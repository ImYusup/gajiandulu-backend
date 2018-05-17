require('module-alias/register');
const { response } = require('@helpers');
const {
  company_settings: CompanySettingModel,
  companies: CompanyModel
} = require('@models');

const companySettingService = {
  create: async (req, res) => {
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
      const payload = Object.assign({}, data, {
        company_id: companyId
      });
      company = await CompanySettingModel.create(payload);
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
