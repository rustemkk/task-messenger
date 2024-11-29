# task-messenger (Only1 Assignment)

To install dependencies:

```bash
bun install
```

To run:

```bash
bun dev
```

What was done:
1) implemented backend server with simple custom router
2) implemented database migrations
3) implemented frontend app that builds and serves with the same backend server
4) implemented basic LoginPage with storing current user in localStorage
5) implemented HomePage with list of accounts to chat with
6) implemented ChatPage with messages list and input

Comments:
All libraries except react and react-hook-form are new for me, so it took good amount of time to set them up together. Due to lack of time left, did only simple inline styling.

Thank you and looking forward for your feedback!



# Only1 Assignment

You are **only** allowed to use, and **must** use, the following runtimes/libraries:

- [Bun](https://bun.sh/)
- React 18/19
- Tailwind CSS 3/4
- TanStack Start
- TanStack Query 5
- React Aria Components
- React Aria Components Tailwind CSS Plugin
- React Hook Form with Zod
- SQLite (accessed via `bun:sqlite`) ([Bun SQLite API](https://bun.sh/docs/api/sqlite))
- TypeScript

The usage of `any` is **strictly prohibited**. Type casts via `as` are strongly discouraged.

Use of React's `useEffect` hook is **strictly prohibited**.

TanStack Query's suspense queries, suspense infinite queries, and mutations **must** be used as much as possible.

All of your code **must** be in a single isomorphic codebase (a codebase with a single `package.json`).

Your project **must** be fully setup and runnable by executing the following command:
```console
bun i && bun dev
```

## Task

Your task is to create a full-stack messenger application. You have a maximum of 2 days to complete this task.

Put your code into a private GitHub repository and invite `lithdew` to it.

Write a thorough `README.md` that explains in as much detail as possible:

1. What features you've implemented,
2. How you implemented the features, and
3. Difficulties faced in implementing the features.

### Database

You are only allowed to have two tables in this application: one for `accounts`, and another for `messages`.

The `messages` table is provided for you. You **cannot** change, remove, or add any columns to this table.

```sql
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    from_id INTEGER NOT NULL REFERENCES accounts(id),
    to_id INTEGER NOT NULL REFERENCES accounts(id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP NOT NULL
) WITHOUT ROWID;
```

You will be assessed by how performantly and how well you can implement a messenger given just two tables, with the freedom to create any number of indexes required to support queries for your application.

### Website

What features are available in your messenger application are entirely up to you.

This is done intentionally so that you can:

1. Showcase how many features you can implement into an application given just two database tables.
2. Showcase how quickly and how in-depth you can learn and work with new libraries you have never used before.
3. Showcase how much you care about the UX of common everyday applications.

The only requirements are that you have the following:

1. **Conversations List**: A bidirectional infinite list of the most recent conversations you are involved in, where each row representing a conversation contains a snippet of the last message sent in the conversation. When clicking on a row:
    - A bidirectional infinite list of messages sent/received in the conversation should appear.
    - A form for sending a message in the conversation should appear.
2. **User Search**: A combobox for searching for users to message.
3. **Responsive Design**: A makeshift responsive design. All paddings, margins, text, UI components, etc., **must** be neatly presented across all possible screen sizes.

## Advice

### Authentication

Do **not** waste any time creating, for example, a login/register page.

Instead, you can have, for instance, a text input available globally within your application for the user to enter their desired username. When the user enters a username into the text input and presses `Enter`:

1. An account for the specified username gets registered if it does not yet exist.
2. All conversations and messages shown are from the perspective of the account under the username specified.

### React Hook Form

The `ref` from React Hook Form's `<Controller/>` must only be passed to an input HTML element (a `HTMLInputElement`). Some React Aria Components may not explicitly expose an input ref; therefore, you may need to drop down to using React Aria hooks.
