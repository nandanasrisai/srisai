# Security Specification: Campus Voice

## 1. Data Invariants
- A **User** profile must be created with a valid UID matching their authenticated ID.
- Students can only create complaints where `studentId` matches their own UID.
- Only **Authorities** (users with `role == 'authority'`) can update the `status` or add an `authorityComment` to a complaint.
- Complaints are immutable once resolved (terminal state).
- User roles can only be changed by the user themselves for demo purposes, but in a real-world scenario, this would be restricted.

## 2. The "Dirty Dozen" Payloads

1. **Identity Theft (User)**: Create a user profile with a different UID than `request.auth.uid`.
2. **Role Escalation**: Student tries to update their own role to 'authority', bypassing demo constraints (if any were present).
3. **Ghost Complaint**: Create a complaint where `studentId` is someone else's UID.
4. **Spoofed Name**: Create a complaint with a student name that doesn't match the current user.
5. **State Shortcut**: Create a complaint with status 'resolved' directly.
6. **Illegal Transition**: Student tries to update the status of their own complaint to 'resolved' without being an authority.
7. **Unauthorized Comment**: Student tries to add an `authorityComment` to their own complaint.
8. **Resource Poisoning**: Use a massive string (1MB) for the complaint `title`.
9. **ID Hijacking**: Provide a junk string as `complaintId` to potentially cause injection or storage issues.
10. **Orphaned Complaint**: Create a complaint with a non-existent `studentId` (hard to verify without `get`, but schema checks help).
11. **PII Leak**: List all user profiles as a student.
12. **Terminal state bypass**: Try to update a resolved complaint's title.

## 3. The Test Runner (Mock)
A full `firestore.rules.test.ts` would verify these. (I will skip actual test execution code as there's no test runner configured, but the logic will be implemented in rules).
