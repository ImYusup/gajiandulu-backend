require('module-alias/register');
const { response } = require('@helpers');
const {
  feedbacks: Feedback,
  feedback_conversations: FeedbackConversation
} = require('@models');

const feedbackService = {
  get: async (req, res) => {
    const { id: userId } = res.local.users;
    try {
      const feedbacks = await Feedback.findAll({
        where: { user_id: userId },
        include: [{ model: FeedbackConversation, as: 'conversations' }]
      });

      if (!feedbacks) {
        return res
          .status(422)
          .json(
            response(false, `Feedbacks data with user id ${userId} not found`)
          );
      }
      return res
        .status(200)
        .json(
          response(
            true,
            'Feedbacks has been successfully retrieved',
            feedbacks,
            null
          )
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  },

  create: async (req, res) => {
    const { id: userId } = res.local.users;
    const { data } = req.body;
    try {
      const feedback = await Feedback.create(
        {
          user_id: userId,
          summary: data.summary,
          conversations: {
            commentable_id: userId,
            body: data.message
          }
        },
        {
          include: [
            {
              model: FeedbackConversation,
              as: 'conversations'
            }
          ]
        }
      );

      if (feedback === null) {
        return res.status(400).json(response(true, 'Can not create feedback'));
      }
      return res
        .status(200)
        .json(
          response(
            true,
            'Feedback has been successfully created',
            feedback,
            null
          )
        );
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = feedbackService;
