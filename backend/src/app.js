import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { ApiError } from "./utils/ApiError.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import authRoute from "./routes/auth.route.js"
import claimRoute from "./routes/claim.route.js"
import postRoute from "./routes/post.route.js"
import userRoute from "./routes/user.route.js"

const app = express();
app.use(express.json());
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    name: "tiger",
    age: 21,
    date: "03-08-2025",
  });
});

app.get("/test/:id", (req, res) => {
  const { id } = req.params;

  // Dummy product data
  const product = {
    title: "Awesome Product",
    description: "This is an amazing product you must check out!",
    image: "https://myosop.com/static/images/banners/Myosop.png",
    url: `https://app.myosop.com/products/${id}` // This is the clickable URL for the OG card
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>${product.title}</title>

      <!-- Open Graph Meta -->
      <meta property="og:title" content="${product.title}" />
      <meta property="og:description" content="${product.description}" />
      <meta property="og:image" content="${product.image}" />
      <meta property="og:url" content="${product.url}" /> <!-- This makes the card clickable -->

      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${product.title}" />
      <meta name="twitter:description" content="${product.description}" />
      <meta name="twitter:image" content="${product.image}" />
      <meta name="twitter:url" content="${product.url}" />
    </head>
    <body style="text-align:center;font-family:sans-serif;padding:20px;">
      <script>
        // Try to open app first
        window.location.href = "https://app.myosop.com";

        // Fallback: after 2 seconds, stay on this page (or show a button)
        setTimeout(() => {
          document.body.innerHTML += '<p>If app does not open, view in browser: <a href="${product.url}">${product.url}</a></p>';
        }, 2000);
      </script>
    </body>
    </html>
  `;

  res.send(html);
});



app.use("/api/v1/users",userRoute)
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/claims",claimRoute)
app.use("/api/v1/posts", postRoute);

// error middelware
app.use(errorMiddleware);

export { app };
