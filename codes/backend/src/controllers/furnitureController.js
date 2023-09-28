// controllers/furnitureController.js
const { Furniture } = require("../models/furniture"); // Import your Furniture model
const { Requested } = require("../models/requested"); 
const { User } = require("../models/user");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Configure multer to specify where to store uploaded files
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// const imagePath = path.join(__dirname, "chair.jpeg");
// const imageURL = fs.readFileSync(imagePath);
const AWS = require("aws-sdk"); // Import AWS SDK
const s3 = new AWS.S3();

const bucketName = "bearcatbucket"; // Replace with your bucket name
const bucketPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "AllowAllActions",
      Effect: "Allow",
      Principal: "*",
      Action: "s3:*",
      Resource: `arn:aws:s3:::${bucketName}/*`,
    },
  ],
};

const updatedCorsRules = [
  {
    AllowedOrigins: ["*"], // Replace with your frontend domain
    AllowedMethods: ["GET"],
    AllowedHeaders: ["*"],
    MaxAgeSeconds: 3000,
  },
];

// Define the CORS configuration
const corsConfiguration = {
  CORSRules: updatedCorsRules,
};

// Apply the bucket policy
const params = {
  Bucket: bucketName,
  Policy: JSON.stringify(bucketPolicy),
};

// Set the CORS configuration for the bucket
const corsParams = {
  Bucket: bucketName,
  CORSConfiguration: corsConfiguration,
};

s3.putBucketPolicy(params, (err, data) => {
  if (err) {
    console.error("Error applying bucket policy:", err);
  } else {
    console.log("Bucket policy applied successfully");
  }
});

s3.putBucketCors(corsParams, (err, data) => {
  if (err) {
    console.error("Error updating bucket CORS configuration:", err);
  } else {
    console.log("Bucket CORS configuration updated successfully");
  }
});

/// Function to create a new furniture record
// async function createFurniture(req, res) {
//   try {
//     const {
//       name,
//       condition,
//       yearsUsed,
//       imageUrl,
//       category,
//       furniture_description,
//       userEmail, // Add userEmail to the request body
//     } = req.body;

//     // Find the user by email to get the user ID
//     const user = await User.findOne({ where: { email: userEmail } });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Create a new furniture record in the database with today's date for Donated_date
//     const furniture = await Furniture.create({
//       name,
//       condition,
//       yearsUsed,
//       imageUrl,
//       category,
//       furniture_description, // New column
//       Donated_date: new Date(), // Set Donated_date to today's date
//       user_id: user.id, // Use the retrieved user ID
//     });

//     res
//       .status(201)
//       .json({ message: "Furniture created successfully", furniture });
//   } catch (error) {
//     console.error("Error creating furniture:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

async function createFurniture(req, res) {
  const uploadedImage = req.files["image"][0];
  try {
    const {
      name,
      condition,
      yearsUsed,
      category,
      furniture_description,
      userEmail, // Add userEmail to the request body
    } = req.body;

    console.log(
      name +
        " " +
        condition +
        " " +
        yearsUsed +
        " " +
        category +
        " " +
        furniture_description +
        " " +
        userEmail
    );
    // Find the user by email to get the user ID
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a unique filename for the image using the furniture name
    const imageKey = `${name}-${Date.now()}.jpeg`;

    // Configure the S3 parameters for uploading the image
    const s3Params = {
      Bucket: "bearcatbucket", // Use the furniture name as the bucket name
      Key: imageKey, // Use the unique filename for the image
      // Body: imageURL, // The image file
      Body: uploadedImage,
      ACL: "public-read", // Make the uploaded image public-readable
      ContentType: "image/jpeg",
    };

    // Upload the image to S3
    const s3UploadResponse = await s3.upload(s3Params).promise();

    // Get the URL of the uploaded image
    const imageUrl = s3UploadResponse.Location;

    console.log("image url " + imageUrl);
    // Create a new furniture record in the database with today's date for Donated_date
    const furniture = await Furniture.create({
      name,
      furniture_condition: condition,
      years_used: yearsUsed,
      image_url: imageUrl,
      furniture_type: category,
      furniture_description: furniture_description, // New column
      Donated_date: new Date(), // Set Donated_date to today's date
      user_id: user.id, // Use the retrieved user ID
    });

    res
      .status(201)
      .json({ message: "Furniture created successfully", furniture });
  } catch (error) {
    console.error("Error creating furniture:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to get all available furniture records
async function getAllFurniture(req, res) {
  try {
    // Retrieve all furniture records with status "available" from the database
    const furnitureList = await Furniture.findAll({
      where: { status: "available" },
    });

    res.status(200).json(furnitureList);
  } catch (error) {
    console.error("Error retrieving available furniture:", error);
    res.status(500).json({
      message: "Error retrieving available furniture",
      error: error.message,
    });
  }
}

// Function to get one furniture record by ID
async function getFurnitureById(req, res) {
  try {
    const { id } = req.params; // Get the ID from the request parameters

    // Find the available furniture record by ID in the database
    const furniture = await Furniture.findOne({
      where: {
        id,
        status: ["available", "requested"],
      },
    });

    if (!furniture) {
      return res.status(404).json({ message: "Available furniture not found" });
    }

    
    const user = await User.findOne({ where: { id: furniture.user_id } });
    console.log(user.email);
    furniture.dataValues.user_email = user.email;
    console.log(furniture)
    res.status(200).json(furniture);
  } catch (error) {
    console.error("Error retrieving available furniture by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to update a specific furniture record by ID
async function updateFurniture(req, res) {
  try {
    // const { id } = req.params;
    const {
      id,
      name,
      furniture_condition,
      years_used,
      image_url,
      furniture_type,
      furniture_description,
      status,
      userEmail, // Add userEmail to the request body
    } = req.body;

    // Retrieve the furniture record by ID from the database
    const furniture = await Furniture.findByPk(id);

    console.log(furniture.status);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }

    // Check if the status is changing from "requested" to "cancelled"
    if (furniture.status === "requested" && status === "cancelled") {
      // Update the furniture status to "available"
      furniture.status = "available";

      // Find the user by email to get the user ID
      const user = await User.findOne({ where: { email: userEmail } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete the user record from the Requested table
      await Requested.destroy({
        where: { user_id: user.id, furniture_id: id },
      });
    }

    // Update the furniture record properties if provided
    if (name) {
      furniture.name = name;
    }
    if (furniture_condition) {
      furniture.furniture_condition = furniture_condition;
    }
    if (years_used) {
      furniture.years_used = years_used;
    }
    if (image_url) {
      furniture.image_url = image_url;
    }
    if (furniture_type) {
      furniture.furniture_type = furniture_type;
    }
    if (furniture_description) {
      furniture.furniture_description = furniture_description;
    }
    if (status === "requested" || status === "closed") {
      furniture.status = status;
    }

    // Save the updated furniture record to the database
    await furniture.save();

    // Check if the status is changed to "requested"
    if (status === "requested") {
      // Find the user by email to get the user ID
      const user = await User.findOne({ where: { email: userEmail } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const requestDate = new Date();
      // Add a record to the Requested table
      await Requested.create({
        user_id: user.id,
        furniture_id: id,
        request_date: requestDate,
      });
    }

    res
      .status(200)
      .json({ message: "Furniture updated successfully", furniture });
  } catch (error) {
    console.error("Error updating furniture:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to update a specific furniture record by ID
// async function updateFurniture(req, res) {
//   try {
//     const { id } = req.params;
//     const {
//       name,
//       furniture_condition,
//       years_used,
//       image, // Change the name from image_url to image
//       furniture_type,
//       furniture_description,
//       status,
//       userEmail, // Add userEmail to the request body
//     } = req.body;

//     // Retrieve the furniture record by ID from the database
//     const furniture = await Furniture.findByPk(id);

//     if (!furniture) {
//       return res.status(404).json({ message: "Furniture not found" });
//     }

//     // Check if the status is changing from "requested" to "cancelled"
//     if (furniture.status === "requested" && status === "cancelled") {
//       // Update the furniture status to "available"
//       furniture.status = "available";

//       // Find the user by email to get the user ID
//       const user = await User.findOne({ where: { email: userEmail } });

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // Delete the user record from the Requested table
//       await Requested.destroy({
//         where: { user_id: user.id, furniture_id: id },
//       });
//     }

//     // Update the furniture record properties if provided
//     if (name) {
//       furniture.name = name;
//     }
//     if (furniture_condition) {
//       furniture.furniture_condition = furniture_condition;
//     }
//     if (years_used) {
//       furniture.years_used = years_used;
//     }

//     // Handle image update
//     if (image) {
//       // Generate a unique filename for the image using the furniture name
//       const imageKey = `${furniture.name}-${Date.now()}.jpg`;

//       // Configure the S3 parameters for uploading the image
//       const s3Params = {
//         Bucket: furniture.name, // Use the furniture name as the bucket name
//         Key: imageKey, // Use the unique filename for the image
//         Body: image, // The new image file
//         ACL: "public-read", // Make the uploaded image public-readable
//       };

//       // Upload the new image to S3
//       const s3UploadResponse = await s3.upload(s3Params).promise();

//       // Get the URL of the uploaded image and update the furniture's image_url
//       furniture.image_url = s3UploadResponse.Location;
//     }

//     if (furniture_type) {
//       furniture.furniture_type = furniture_type;
//     }
//     if (furniture_description) {
//       furniture.furniture_description = furniture_description;
//     }
//     if (status === "requested" || status === "closed") {
//       furniture.status = status;
//     }

//     // Save the updated furniture record to the database
//     await furniture.save();

//     // Check if the status is changed to "requested"
//     if (status === "requested") {
//       // Find the user by email to get the user ID
//       const user = await User.findOne({ where: { email: userEmail } });

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const requestDate = new Date();
//       // Add a record to the Requested table
//       await Requested.create({
//         user_id: user.id,
//         furniture_id: id,
//         request_date: requestDate,
//       });
//     }

//     res
//       .status(200)
//       .json({ message: "Furniture updated successfully", furniture });
//   } catch (error) {
//     console.error("Error updating furniture:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// Function to delete a specific furniture record by ID
// Function to update the status of a specific furniture record to "deleted" by ID
async function deleteFurniture(req, res) {
  try {
    const { id } = req.params;

    // Retrieve the furniture record by ID from the database
    const furniture = await Furniture.findByPk(id);

    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }

    // Update the furniture status to "deleted"
    furniture.status = "deleted";
    await furniture.save();

    res.status(200).json({ message: "Furniture marked as deleted" });
  } catch (error) {
    console.error("Error marking furniture as deleted:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// async function requestFurniture(req, res) {
//   try {
//     // Get the user's email and furniture ID from the request body
//     const { userEmail, furnitureId } = req.body;

//     // Find the user by email to get the user ID
//     const user = await User.findOne({ where: { email: userEmail } });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Find the furniture item by ID
//     const furniture = await Furniture.findByPk(furnitureId);

//     if (!furniture) {
//       return res.status(404).json({ message: "Furniture not found" });
//     }

//     // Check if the furniture is available
//     if (furniture.status === "available") {
//       // Change the status to "requested"
//       furniture.status = "requested";
//       await furniture.save();

//       const requestDate = new Date();
//       // Add a record to the Requested table
//       await Requested.create({
//         user_id: user.id,
//         furniture_id: furnitureId,
//         request_date: requestDate,
//       });

//       return res
//         .status(200)
//         .json({ message: "Furniture requested successfully" });
//     } else {
//       return res.status(400).json({ message: "Furniture is not available" });
//     }
//   } catch (error) {
//     console.error("Error requesting furniture:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// Function to get all closed furniture records based on user email
async function getClosedFurniture(req, res) {
  try {
    const { userEmail } = req.body;

    // Find the user by email to get the user ID
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all furniture records with status "closed" and the user's ID
    const closedFurnitureList = await Furniture.findAll({
      where: {
        user_id: user.id,
        status: "closed",
      },
    });

    res.status(200).json(closedFurnitureList);
  } catch (error) {
    console.error("Error retrieving closed furniture:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to get all available and requested furniture records based on user email
async function getAvailableAndRequestedFurniture(req, res) {
  try {
    const { userEmail } = req.body;

    // Find the user by email to get the user ID
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all furniture records with status "available" or "requested" and the user's ID
    const furnitureList = await Furniture.findAll({
      where: {
        user_id: user.id,
        status: ["available", "requested"],
      },
    });

    res.status(200).json(furnitureList);
  } catch (error) {
    console.error("Error retrieving available and requested furniture:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to get all requested records for a specific user based on user email
async function getRequestedFurnitureForUser(req, res) {
  try {
    const { userEmail } = req.body;

    // Find the user by email to get the user ID
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all requested records for the user from the Requested table
    const requestedRecords = await Requested.findAll({
      where: { user_id: user.id },
    });

    // Create an array to store the requested furniture records with their status
    const requestedFurniture = [];

    // Iterate through each requested record and check the status of the corresponding furniture
    for (const record of requestedRecords) {
      const furniture = await Furniture.findByPk(record.furniture_id);

      if (
        furniture &&
        (furniture.status === "available" || furniture.status === "requested")
      ) {
        requestedFurniture.push(
furniture,
        );
      }
    }

    res.status(200).json(requestedFurniture);
  } catch (error) {
    console.error("Error retrieving requested furniture for user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to get all furniture records with status "available" or "requested" for a specific user
async function getFurnitureForUser(req, res) {
  try {
    const { userEmail } = req.body;

    // Find the user by email to get the user ID
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all furniture records for the user with status "available" or "requested"
    const furnitureRecords = await Furniture.findAll({
      where: {
        user_id: user.id,
        status: ["available", "requested"],
      },
    });

    res.status(200).json(furnitureRecords);
  } catch (error) {
    console.error("Error retrieving furniture records for user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to search for furniture records based on a keyword or sentence
async function searchFurniture(req, res) {
  try {
    const { keyword } = req.body;

    // Search for furniture records where any column value matches the keyword (case-insensitive)
    const furnitureRecords = await Furniture.findAll({
      where: {
        [Sequelize.Op.or]: [
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("name")),
            "LIKE",
            `%${keyword.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("furniture_condition")),
            "LIKE",
            `%${keyword.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("years_used")),
            "LIKE",
            `%${keyword.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("image_url")),
            "LIKE",
            `%${keyword.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("furniture_type")),
            "LIKE",
            `%${keyword.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("furniture_description")),
            "LIKE",
            `%${keyword.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("status")),
            "LIKE",
            `%${keyword.toLowerCase()}%`
          ),
        ],
      },
    });

    res.status(200).json(furnitureRecords);
  } catch (error) {
    console.error("Error searching for furniture records:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Add more controller functions for updating and deleting furniture records as needed
module.exports = {
  createFurniture,
  getAllFurniture,
  getFurnitureById,
  updateFurniture,
  deleteFurniture,
  // Add other functions here
  getClosedFurniture,
  getAvailableAndRequestedFurniture,
  getRequestedFurnitureForUser,
  getFurnitureForUser,
  searchFurniture,
};
