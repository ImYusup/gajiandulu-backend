require('module-alias/register');
const { response } = require('@helpers');
const {
  feedback_conversations: FeedbackConversation,
  feedbacks: Feedback
} = require('@models');

const feedbackConversationService = {
  get: async (req, res) => {
    const { id: feedback_id } = req.params;
    try {
      const feedback = await FeedbackConversation.findOne({
        where: { id: feedback_id }
      });
      if (feedback === null) {
        return res
          .status(422)
          .json(
            response(
              false,
              `FeedbackConversation with id ${feedback_id} not found`
            )
          );
      }
      return res
        .status(200)
        .json(
          response(
            true,
            'FeedbackConversation retrieved successfully',
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
  },

  create: async (req, res) => {
    const { id: userId } = res.local.users;
    const { data } = req.body;
    try {
      const feedback = await Feedback.findOne({
        where: { id: data.feedback_id }
      });
      if (!feedback) {
        return res
          .status(422)
          .json(
            response(true, `Feedback with id ${data.feedback_id} is not found`)
          );
      }
      const payload = Object.assign(
        {}, 
        {
          feedback_id:data.feedback_id,
          commentable_id: userId,
          body: data.message
        }
      );
      let feedbackConversation = await FeedbackConversation.create(payload);
      if (feedbackConversation) {
        return res
          .status(200)
          .json(response(true, 'Message sent', feedbackConversation, null));
      }
    } catch (error) {
      if (error.errors) {
        return res.status(400).json(response(false, error.errors));
      }
      return res.status(400).json(response(false, error.message));
    }
  }
};

module.exports = feedbackConversationService;
