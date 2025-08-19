app.post("/dashboard",(req,res)=>{
//     const {title , content } = req.body;
//     let blog=[];
//     blog = JSON.parse(fs.readFileSync(path.join(__dirname, "blogs.json"), "utf-8"));
//     blog.push({
//         title:title,
//         content:content,
//         createdAt : new Date().toISOString()
//     })
//     fs.writeFileSync(path.join(__dirname, "blogs.json"), JSON.stringify(blog));
// })