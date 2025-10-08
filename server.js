const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "/login.html"));
});
app.get("/sign-up", (req, res) => {
    res.sendFile(path.join(__dirname, "/sign-up.html"));
});
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "/dashboard.html"));
});

// New endpoint to get all blogs
app.get("/get-blogs", (req, res) => {
    try {
        const blogs = JSON.parse(fs.readFileSync(path.join(__dirname, "blogs.json"), "utf-8"));
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to load blogs" });
    }
});

app.post("/sign-up", (req, res) => {
    let users = [];
    const { name, email, passwrd } = req.body;
    users = JSON.parse(fs.readFileSync(path.join(__dirname, "user.json"), "utf-8"));
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.status(400).send("User with this email already exists");
    }
    users.push({
        name,
        email,
        passwrd,
        CreateAt: new Date().toISOString()
    });

    fs.writeFileSync(path.join(__dirname, "user.json"), JSON.stringify(users));
    res.redirect("/login");
});

app.post("/login", (req, res) => {
    const { email, passwrd } = req.body;
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, "user.json"), "utf-8"));
    
    const user = users.find(u => u.email === email && u.passwrd === passwrd);
    
    if (!user) {
        return res.status(401).send("Invalid email or password");
    }
    
    res.redirect("/dashboard");
});

app.post("/dashboard", (req, res) => {
    const { title, content } = req.body;
    let blogs = [];
    try {
        blogs = JSON.parse(fs.readFileSync(path.join(__dirname, "blogs.json"), "utf-8"));
    } catch (error) {
        console.error("Error reading blogs file:", error);
    }
    
    blogs.push({
        title: title,
        content: content,
        createdAt: new Date().toISOString()
    });
    
    try {
        fs.writeFileSync(path.join(__dirname, "blogs.json"), JSON.stringify(blogs, null, 2));
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error writing to blogs file:", error);
        res.status(500).json({ error: "Failed to save blog" });
    }
});

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server running on port 3000");
    }

});
