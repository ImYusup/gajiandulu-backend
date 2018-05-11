require('module-alias/register');
const { response } = require('@helpers');
const {
  loans: Loan,
  users: User,
  digital_assets: DigitalAsset,
  promos: Promo
} = require('@models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const loanService = {
  find: async (req, res) => {
    const { id: user_id } = res.local.users;
    try {
      const loan = await Loan.findAll({ where: { user_id: user_id } });
      return res
        .status(200)
        .json(response(true, 'Loan retrieved successfully', loan, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  get: async (req, res) => {
    const { id: loanId } = req.params;
    const { id: user_id } = res.local.users;

    try {
      const loan = await Loan.findOne({
        where: [Op.and][({ id: loanId }, { user_id: user_id })]
      });
      if (loan === null) {
        return res
          .status(200)
          .json(response(false, `Loan with id ${loanId} not found`));
      }
      return res
        .status(200)
        .json(response(true, 'Loan retrieved successfully', loan, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  patch: async (req, res) => {
    const {
      amount,
      period,
      service_charge,
      interest_rate,
      interest_charge,
      due_date_charge,
      purpose,
      materai_charge,
      due_date,
      promo_code,
      promo_discount,
      paid,
      status
    } = req.body.data;

    const { id: user_id } = res.local.users;
    const { id: loanId } = req.params;
    const total = Number(amount) + Number(service_charge);

    const payload = Object.assign(
      {},
      {
        user_id,
        amount,
        period,
        service_charge,
        interest_rate,
        interest_charge,
        due_date_charge,
        purpose,
        materai_charge,
        due_date,
        promo_code,
        promo_discount,
        paid,
        status,
        total
      }
    );

    try {
      let loan = await Loan.findOne({ where: { id: loanId } });
      if (loan === null) {
        return res
          .status(400)
          .json(response(false, `Loan with id ${loanId} not found`));
      }

      const updateLoan = await Loan.update(payload, { where: { id: loanId } });
      if (updateLoan[0] === 0) {
        return response
          .status(4000)
          .json(response(false, `Updating loan with ${loanId} was failed`));
      }

      loan = await Loan.findOne({ where: { id: loanId } });

      return res
        .status(200)
        .json(response(true, 'Loan updated successfully', loan, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  create: async (req, res) => {
    // const { data } = req.body;
    const {
      amount,
      period,
      service_charge,
      interest_rate,
      interest_charge,
      due_date_charge,
      purpose,
      materai_charge,
      due_date,
      promo_code,
      promo_discount,
      paid,
      status
    } = req.body.data;

    const { id: user_id } = res.local.users;
    const user = await User.findOne({ where: { id: user_id } });
    if (!user.is_confirmed_email) {
      return res
        .status(400)
        .json(
          response(
            false,
            'Kamu tidak dapat mengajukan pinjaman sebelum konfirmasi Email. Periksa inbox / spam Email.'
          )
        );
    }
    const ktp = await DigitalAsset.findOne({
      where: { [Op.and]: [{ user_id: user_id }, { type: 'kartu_identitas' }] }
    });
    if (!ktp || !ktp.is_verified) {
      return res
        .status(400)
        .json(
          response(
            false,
            'Mohon konfirmasi informasi kamu dengan menambahkan dokumen KTP / SIM / Passpor'
          )
        );
    }
    const tabungan = await DigitalAsset.findOne({
      where: { [Op.and]: [{ user_id: user_id }, { type: 'buku_tabungan' }] }
    });
    if (!tabungan) {
      return res
        .status(400)
        .json(
          response(
            false,
            'Gajian dulu diperuntukan eksekutif muda yang memiliki gaji bulanan. Upload bukti gaji dahulu / Maaf bukti gaji belum terverifikasi'
          )
        );
    }
    // @TODO change
    let total;
    if (promo_code) {
      const discount = await Promo.findOne({
        where: { code: promo_code }
      });

      if (!discount) {
        return res.status(400).json(response(false, 'Promo code not found!'));
      } else {
        const debit = Number(discount.discount);
        total = Number(amount) + Number(service_charge) - debit;
      }
    }

    if (!promo_code) {
      total = Number(amount) + Number(service_charge);
    }

    try {
      const payload = Object.assign(
        {},
        {
          user_id,
          amount,
          period,
          service_charge,
          interest_rate,
          interest_charge,
          due_date_charge,
          purpose,
          materai_charge,
          due_date,
          promo_code,
          promo_discount,
          paid,
          status,
          total
        }
      );
      const loan = await Loan.create(payload);
      return res
        .status(201)
        .json(response(true, 'Loan created successfully', loan, null));
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  remove: async (req, res) => {
    const { id: loanId } = req.body;
    try {
      const loan = await Loan.destroy({ where: { id: loanId } });
      if (loan === 0) {
        return res
          .status(400)
          .json(response(false, `Loan with id ${loanId} not found`));
      }
      return null;
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = loanService;
