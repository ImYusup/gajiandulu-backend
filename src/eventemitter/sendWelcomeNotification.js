const { oneSignalApi } = require('@helpers');
const {
  notifications: Notif,
  employees: Employee,
  users: User,
  companies: Company
} = require('@models');
const Observable = require('./observable');
const EVENT = require('./constants');

const observable = new Observable();
const sendWelcomeNotification = async (bindName, data) => {
  observable.addListener(EVENT.SEND_WELCOME, async data => {
    const BODY_MESSAGE = 'Terimakasih telah mendaftar di GajianDulu';

    await Notif.create({
      employee_id: data.employeeId,
      body: BODY_MESSAGE
    });

    // prettier-ignore
    /* eslint-disable quotes */
    const payload = {
      "app_id": "680226d3-4d46-4a02-acd0-31e408fa0255",
      "filters": [
        {"field": "tag", "key": "userId", "relation": "=", "value": data.userId}
      ],
      "data": {"foo": "bar"},
      "headings": {"en": "Selamat Datang di GajianDulu"},
      "contents": {"en": BODY_MESSAGE}
    };
    oneSignalApi.post('/notifications', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic OGM4YzkxZmItMDNmZS00ZjRmLWJjMTctNWFjMGZiNGEzYjUx'
      }
    });
  });

  observable.addListener(EVENT.NEW_EMPLOYEE_JOINED, async data => {
    const employeeData = await Employee.findOne({
      where: { user_id: data.userId },
      attributes: ['role'],
      include: [
        {
          model: User,
          attributes: ['full_name']
        },
        { model: Company, attributes: ['name'] }
      ]
    });

    const managerData = await Employee.findAll({
      where: { company_id: data.companyId, role: '1' }
    });
    const HEADING_MESSAGE = `${
      employeeData.user.full_name
    } baru saja bergabung`;
    const BODY_MESSAGE = `${
      employeeData.user.full_name
    } baru saja bergabung ke ${employeeData.company.name} sebagai ${
      employeeData.role.toString() === '1' ? 'Manajer' : 'Anggota'
    }`;

    let filters = [];
    let payloadNotif = [];
    for (let i = 0; i < managerData.length; i++) {
      payloadNotif.push({
        employee_id: managerData[i].id,
        body: BODY_MESSAGE
      });
      // prettier-ignore
      /* eslint-disable quotes */
      filters.push({"field": "tag", "key": "employeeId", "relation": "=", "value": managerData[i].id}, {"operator": "OR"});
    }
    filters.splice(-1, 1);
    await Notif.bulkCreate(payloadNotif);

    // prettier-ignore
    /* eslint-disable quotes */
    const payload = {
      "app_id": "680226d3-4d46-4a02-acd0-31e408fa0255",
      "filters": filters,
      "headings": {"en": HEADING_MESSAGE},
      "contents": {"en": BODY_MESSAGE}
    };
    oneSignalApi.post('/notifications', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic OGM4YzkxZmItMDNmZS00ZjRmLWJjMTctNWFjMGZiNGEzYjUx'
      }
    });
  });

  // Emit the events
  observable.emit(bindName, data);
};

module.exports = sendWelcomeNotification;
