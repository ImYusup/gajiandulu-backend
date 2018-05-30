require('module-alias/register');
const { response } = require('@helpers');
const {
  digital_assets: DigitalAsset,
  employees: Employee,
  users: User,
  presences: Presence
} = require('@models');

const presenceService = {
  get: async (req, res) => {
    const { company_id, presence_id } = req.params;

    try {
      const presences = await Presence.findOne({
        where: { id: presence_id },
        include: [
          {
            model: Employee,
            where: { company_id: company_id },
            include: [
              {
                model: User
              },
              {
                model: DigitalAsset,
                required: false,
                attributes: ['url', 'type'],
                where: {
                  type: 'avatar'
                },
                as: 'assets'
              }
            ]
          }
        ]
      });
      let result = Object.assign({
        id: presences.id,
        presence_date: presences.presence_date,
        presence_start: presences.presence_start,
        presence_end: presences.presence_end,
        rest_start: presences.rest_start,
        rest_end: presences.rest_end,
        presence_overdue: presences.presence_overdue,
        is_absence: presences.is_absence,
        is_leave: presences.is_leave,
        overwork: presences.overwork,
        work_hours: presences.work_hours,
        salary: presences.salary,
        fine: presences.fine,
        employee: {
          id: presences.employee.id,
          role: presences.employee.role,
          full_name: presences.employee.user.full_name,
          email: presences.employee.user.email,
          phone: presences.employee.user.phone,
          assets: presences.employee.assets
        }
      });
      if (!presences) {
        return res
          .status(400)
          .json(response(false, `Presences with id ${presence_id} not found`));
      }
      return res
        .status(200)
        .json(response(true, 'Presence detail retrieved successfully', result));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  find: async (req, res) => {
    const { company_id: companyId } = req.params;
    const presence_date = req.query.date;

    try {
      const presences = await Presence.findAll({
        where: { presence_date: req.query.date },
        include: [
          {
            model: Employee,
            where: { company_id: companyId },
            include: [
              {
                model: User
              },
              {
                model: DigitalAsset,
                required: false,
                attributes: ['url', 'type'],
                where: {
                  type: 'avatar'
                },
                as: 'assets'
              }
            ]
          }
        ]
      });
      let presenceList = [];
      presences.map(data => {
        let result = Object.assign({
          id: data.id,
          presence_date: data.presence_date,
          presence_start: data.presence_start,
          presence_end: data.presence_end,
          rest_start: data.rest_start,
          rest_end: data.rest_end,
          presence_overdue: data.presence_overdue,
          is_absence: data.is_absence,
          is_leave: data.is_leave,
          overwork: data.overwork,
          work_hours: data.work_hours,
          salary: data.salary,
          fine: data.fine,
          employee: {
            id: data.employee.id,
            role: data.employee.role,
            full_name: data.employee.user.full_name,
            email: data.employee.user.email,
            phone: data.employee.user.phone,
            assets: data.employee.assets
          }
        });
        presenceList.push(result);
      });
      if (!presences) {
        return res
          .status(400)
          .json(
            response(false, `Presences list with id ${presence_date} not found`)
          );
      }
      return res
        .status(200)
        .json(
          response(true, 'Presences list retrieved successfully', presenceList)
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = presenceService;
