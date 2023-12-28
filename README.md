# Auction Management App

Welcome to the Auction Management App! This app allows users to create and participate in auctions for various items. Below are the features and commands to run this React project on your machine.

## Features

### Auction Listing

The app displays a list of ongoing auctions, showing item images, titles, current highest bids, and time remaining for each auction. Users can click on an auction to view more detailed information about the item and its bidding history.

### Auction Creation

Authenticated users can create new auction listings for items they want to sell. A form is provided for users to input item details, starting bid price, auction duration, and upload item images.

### Bidding

Authenticated users can place bids on ongoing auctions. The app implements validation to ensure that bids are higher than the current highest bid and within the auction's time limit.

### User Dashboard

Each user has a personalized dashboard to view their active auctions (those they created) and their bidding history.

## How to Run the Project

Before running the project, ensure you have Node.js and npm (Node Package Manager) installed on your machine.

1. Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/auction-management-app.git
```

2. Navigate to the project directory:

```bash
cd auction-management-app
```

3. Install the project dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Open your web browser and go to `http://localhost:3000` to view the app.

That's it! You now have the Auction Management App up and running on your machine. Enjoy creating and bidding on auctions!
