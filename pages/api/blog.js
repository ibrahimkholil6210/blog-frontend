const posts = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const body = req.body;
    const { title, content, date } = body;
    const post = { title, content, date, id: new Date().getTime() };
    posts.push(post);
    res.status(201).json({ message: "success", post: {...post} });
  }else if(req.method === 'GET') {
      res.status(200).json({ message: "success", posts: posts });
  }
}
