require('module-alias/register');
const { response } = require('@helpers');
const { feedbacks: Feedback, feedback_conversations: FeedbackConversation } = require('@models');

const feedbackService = {
  get: async (req, res) => {
    const { id: userId } = res.local.users;
    try {
      const feedback = await Feedback.findOne({ where: { user_id: userId } });
      // TODO: Need response body following spec
      const feedbackConversation = await FeedbackConversation.findOne({ where: { feedback_id: feedback.dataValues.id } });
      if (!feedback && !feedbackConversation) {
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
            { feedback, conversations: feedbackConversation },
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
      // TODO: Need response body following spec      
      const feedback = await Feedback.create({ user_id: userId, summary: data.summary });
      const feedbackConversation = await FeedbackConversation.create({ feedback_id: feedback.dataValues.id, commentable_id: userId, body: data.message });
      if (feedback) {
        return res
          .status(200)
          .json(
            response(
              true,
              'Feedback has been successfully created',
              { feedback, conversations: feedbackConversation },
              null
            )
          );
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = feedbackService;
