## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#development)
- [Database screenshot](#preview)
- [Trade Off](#trade-offs)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Preview

![Comments Screenshot](https://raw.githubusercontent.com/zhengyelau/feedback-form/main/comments.png)
![Comments Screenshot](https://raw.githubusercontent.com/zhengyelau/feedback-form/main/feedback.png)

## Trade-offs

I attempted to implement a **comment feature for feedback posts**. The challenge was balancing **anonymity** while still allowing users to distinguish between different commenters.

If all comments were fully anonymous, it would be difficult to know whether multiple comments came from the same person or from different people. However, requiring user accounts would increase complexity and go against the goal of keeping the feedback system simple and anonymous.

To address this, I implemented a **random anonymous identity generator**, similar to how platforms like Reddit handle anonymous usernames.

When a user submits feedback, the system:

- Generates a random anonymous identity (similar to Reddit-style anonymous usernames)
- Stores this identity in the browser's `localStorage`
- Uses the stored identity when the user posts comments

This approach allows:

- Users to remain anonymous
- Comments to still appear as coming from consistent identities
- No need to implement a full authentication system

The trade-off is that the identity is stored only in the user's browser. If the user clears their browser storage or uses a different device, a new anonymous identity will be generated.