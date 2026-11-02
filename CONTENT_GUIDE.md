# Alpha Coding School: Content Guide (read this before touching anything)

All commands run from the `server/` folder. Prefix: `npm run content --`

| Task | Command |
|---|---|
| See what exists | `npm run content -- list` |
| Check a course file (no database) | `npm run content -- check content/python-for-dsa.json` |
| Preview a course import | `npm run content -- course content/python-for-dsa.json --dry` |
| Add / update a course | `npm run content -- course content/python-for-dsa.json` |
| Add / update live sessions | `npm run content -- live content/live-sessions.json` |
| Hide a course | `npm run content -- archive-course "Python for DSA"` |
| Delete a live session | `npm run content -- delete-live "Session title"` |
| Delete all old sessions | `npm run content -- delete-live --past` |

## Golden rules
1. **Never run `npm run seed` on a live database.** It wipes all courses and live sessions. It is only for first-time testing.
2. **Always run `list`, then `--dry`, before a real import.**
3. **Keep `content/*.json` in Git.** The files are your source of truth.
4. **Do not delete the `"id"` fields** the script writes into your course file. They keep student progress safe, even if you rename a lesson.
5. **Courses and live sessions are matched by title.** The course title in `live-sessions.json` must exactly equal the course title.
6. **Archive, don't delete,** a course that has students.

## Come back after a long break: checklist
1. `git pull` and open the project.
2. Check `server/.env`: `MONGO_URI` (Atlas or local) and `JWT_SECRET`.
3. Start MongoDB (if local), then `npm install` in `server/`.
4. Run `npm run content -- list` to confirm you are connected to the right database.
5. Take a backup: `mongodump --uri "<MONGO_URI>" --out backup-YYYY-MM-DD`
   (restore with `mongorestore --uri "<MONGO_URI>" backup-YYYY-MM-DD`)
6. Make your change, then `--dry`, then the real run.
7. Log in as a test student and open the course to confirm.

## Add a new course
1. Upload videos to your host (Cloudflare R2, Bunny, S3). Each `videoUrl` must be a direct `.mp4` or `.m3u8` link. YouTube or Vimeo page links will not play.
2. Copy `content/python-for-dsa.json` to a new file and edit it.
3. `check`, then `course ... --dry`, then `course ...`.

## Add or edit lessons, notes, logic, problems
- **New lesson:** add an object at the end of `lessons` (no `id`), then import.
- **Edit notes or logic:** change the text in the file, then import.
- **Rename a lesson:** change the title and keep its `"id"`. Import.
- **Remove a lesson:** delete it from the file and import with `--prune`. Students lose that lesson's tick.
- **Reorder:** reorder in the file and import. Ids keep progress safe.

## Live sessions
- **Add:** put them in `content/live-sessions.json` and run `live`. Time format: `2026-11-08T19:00:00+05:30` (the `+05:30` means IST).
- **Change time or link:** edit the same session, keep its title the same, run `live` again.
- **Rename a session:** run `delete-live "old title"`, then import the new one.
- **After the class:** upload the recording, add it as a new lesson in the course file, import the course, then `delete-live "<title>"`. Students then find it in the course.
- **Clean up:** past sessions disappear from the site by themselves after 2 hours. Run `delete-live --past` now and then to tidy the database.

## Remove a course
- Students enrolled: `archive-course "Title"`. It is hidden from the catalog, and students keep access. Undo with `unarchive-course`.
- No students, and you are sure: `delete-course "Title" --force` (also deletes its live sessions and enrollments).

## Edit one value quickly in MongoDB Compass
Fine for a price, title or description: open the document, click **Edit**, change the field, **Update**. Then copy the same change into the JSON file so the next import doesn't undo it.
