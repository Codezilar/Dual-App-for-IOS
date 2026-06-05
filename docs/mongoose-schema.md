# MongoDB Mongoose Schema

The application uses MongoDB documents modeled with Mongoose:

- `User`: account identity, role, profile metadata.
- `Workspace`: owner, members, and embedded folders.
- `SessionProfile`: isolated browser profile metadata, including `cookieStore`, `storageBucket`, and `cacheNamespace`.
- `AppInstance`: one runnable app instance linked to a workspace and session profile.
- `ActivityLog`: audit trail for instance, profile, user, and workspace events.

Each new instance creates a new `SessionProfile` document first, then stores its `_id` on `AppInstance.profileId`. That keeps browser session isolation durable and queryable while letting MongoDB scale profile metadata horizontally.
