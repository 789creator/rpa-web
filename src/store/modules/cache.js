export default {
  namespaced: true,
  state: {
    violationCheckUploads: [],
    qualificationsReviewUploads: []
  },
  mutations: {
    ADD_VIOLATION_CHECK_UPLOADS (state, val) {
      state.violationCheckUploads.unshift(val)
    },
    ADD_QUALIFICATIONS_REVIEW_UPLOADS (state, val) {
      state.qualificationsReviewUploads.unshift(val)
    },
    DEL_VIOLATION_CHECK_UPLOADS (state, id) {
      const index = state.violationCheckUploads.indexOf(state.violationCheckUploads.find(item => item.id === id))
      if (index > -1) {
        state.violationCheckUploads.splice(index, 1)
      }
    },
    DEL_QUALIFICATIONS_REVIEW_UPLOADS (state, id) {
      const index = state.qualificationsReviewUploads.indexOf(state.qualificationsReviewUploads.find(item => item.id === id))
      if (index > -1) {
        state.qualificationsReviewUploads.splice(index, 1)
      }
    }
  }
}
