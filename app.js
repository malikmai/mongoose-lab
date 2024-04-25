const prompt = require("prompt-sync")();
require("dotenv").config();
const mongoose = require("mongoose");
const Customer = require("./models/customerModel");

const username = prompt('What is your name? ');
console.log(`Your name is ${username}`);

// Display welcome message
console.log("Welcome to the CRM");

// Function to display the menu and get user's choice
const displayMenuAndGetChoice = () => {
  console.log("\nWhat would you like to do?");
  console.log("  1. Create a customer");
  console.log("  2. View all customers");
  console.log("  3. Update a customer");
  console.log("  4. Delete a customer");
  console.log("  5. Quit");
  
  const choice = prompt("Number of action to run: ");
  return parseInt(choice);
};

// Function to handle user's choice
const handleChoice = async (choice) => {
  switch (choice) {
    case 1:
      await createCustomer();
      break;
    case 2:
      await viewCustomers();
      break;
    case 3:
      await updateCustomer();
      break;
    case 4:
      await deleteCustomer();
      break;
    case 5:
      console.log("Exiting...");
      mongoose.connection.close();
      process.exit();
      break;
    default:
      console.log("Invalid choice. Please try again.");
      break;
  }
};

// Function to create a new customer
const createCustomer = async () => {
  const name = prompt("Enter customer's name: ");
  const age = prompt("Enter customer's age: ");
  
  try {
    const newCustomer = await Customer.create({ name, age });
    console.log(`Customer ${newCustomer.name} created successfully.`);
  } catch (error) {
    console.error("Error creating customer:", error);
  }
};

// Function to view all customers
const viewCustomers = async () => {
  try {
    const customers = await Customer.find();
    console.log("List of Customers:");
    customers.forEach(customer => {
      console.log(`id: ${customer._id} --  Name: ${customer.name}, Age: ${customer.age}`);
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
  }
};

// Function to update a customer
const updateCustomer = async () => {
  await viewCustomers();
  const customerId = prompt("Copy and paste the id of the customer you would like to update here: ");
  const newName = prompt("What is the customer's new name? ");
  const newAge = prompt("What is the customer's new age? ");
  
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, { name: newName, age: newAge }, { new: true });
    console.log(`Customer ${updatedCustomer.name} updated successfully.`);
  } catch (error) {
    console.error("Error updating customer:", error);
  }
};

// Function to delete a customer
const deleteCustomer = async () => {
  await viewCustomers();
  const customerId = prompt("Enter the ID of the customer you want to delete: ");
  
  try {
    await Customer.findByIdAndDelete(customerId);
    console.log("Customer deleted successfully.");
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
};

// Main function to run the application
const run = async () => {
  while (true) {
    const choice = displayMenuAndGetChoice();
    await handleChoice(choice);
  }
};

// Connect to MongoDB and start the application
const connectAndRun = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    await run();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit();
  }
};

connectAndRun();