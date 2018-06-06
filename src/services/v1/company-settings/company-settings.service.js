require('module-alias/register');
const { response } = require('@helpers');
const {
  company_settings: CompanySettingModel,
  companies: CompanyModel,
  employees: EmployeeModel,
  digital_assets: DigitalAssetModel,
  users: UserModel
} = require('@models');

const EVENT = require('../../../eventemitter/constants');
const { observe, events } = require('../../../eventemitter');

const companySettingService = {
  get: async (req, res) => {
    const { company_id } = req.params;

    try {
      const company = await CompanyModel.findOne({ where: { id: company_id } });
      if (!company) {
        return res
          .status(400)
          .json(response(false, `Company with id ${company_id} is not found`));
      }

      const manager = await EmployeeModel.findOne({
        where: { company_id, role: 1 },
        include: [
          {
            model: UserModel
          }
        ]
      });
      const assets = await DigitalAssetModel.findAll({
        where: { uploadable_id: manager.id, uploadable_type: 'employees' }
      });
      const companySetting = await CompanySettingModel.findOne({
        where: { company_id }
      });

      const results = {
        id: company.id,
        codename: company.codename,
        name: company.name,
        address: company.address,
        phone: company.phone,
        timezone: company.timezone,
        created_at: company.created_at,
        updated_at: company.updated_at,
        manager: {
          id: manager.id,
          role: manager.role,
          full_name: manager.user.full_name,
          email: manager.user.email,
          phone: manager.user.phone,
          assets
        },
        setting: companySetting
      };

      return res
        .status(200)
        .json(
          response(true, 'Setting has been successfully retrieved', results)
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  create: async (req, res) => {
    const { data } = req.body;
    const { id: companyId } = req.params;
    const { id: user_id, employeeId } = res.local.users;

    try {
      let company = await CompanyModel.findOne({
        where: {
          id: companyId
        }
      });
      if (!company) {
        return res
          .status(400)
          .json(response(false, `Company with id ${companyId} is not found`));
      }
      const payload = Object.assign({}, data, {
        company_id: companyId
      });

      company = await CompanySettingModel.findOne({
        where: { company_id: companyId }
      });
      if (company) {
        return res
          .status(400)
          .json(
            response(
              false,
              `Failed, company settings with id ${companyId} has already exist`
            )
          );
      }
      company = await CompanySettingModel.create(payload);

      await EmployeeModel.create({
        company_id: company.id,
        salary: 0,
        user_id,
        role: 1,
        flag: 3
      });
      await UserModel.update(
        { registration_complete: 1 },
        { where: { id: user_id } }
      );

      // SEND NOTIFICATION WELCOME
      events.UserRegistered.listenUserRegistered();
      observe.emit(EVENT.SEND_WELCOME, {
        userId: user_id,
        employeeId
      });

      return res
        .status(200)
        .json(
          response(
            true,
            'Company settings has been successfully saved',
            company
          )
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  patch: async (req, res) => {
    const { data } = req.body;
    const { id: companyId } = req.params;

    try {
      let company = await CompanyModel.findOne({
        where: {
          id: companyId
        }
      });
      if (!company) {
        return res
          .status(400)
          .json(response(false, `Company with id ${companyId} is not found`));
      }

      if (data) {
        let companySetting = await CompanySettingModel.findOne({
          where: {
            id: companyId
          }
        });
        if (!companySetting) {
          return res
            .status(400)
            .json(
              response(
                false,
                `Company Setting with id ${companyId} is not found`
              )
            );
        }
        await CompanySettingModel.update(data, {
          where: {
            company_id: companyId
          }
        });
      }

      return res
        .status(200)
        .json(response(true, 'Setting has been successfully updated', data));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = companySettingService;
