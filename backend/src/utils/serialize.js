function serializeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl || null,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    instructorProfile: user.instructorProfile
      ? {
          id: user.instructorProfile.id,
          bio: user.instructorProfile.bio,
          expertise: user.instructorProfile.expertise,
          verificationStatus: user.instructorProfile.verificationStatus,
          approvedAt: user.instructorProfile.approvedAt,
          rejectedReason: user.instructorProfile.rejectedReason,
          createdAt: user.instructorProfile.createdAt,
          updatedAt: user.instructorProfile.updatedAt
        }
      : null
  };
}

module.exports = {
  serializeUser
};
