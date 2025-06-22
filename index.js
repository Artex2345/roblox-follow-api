const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());

app.get('/isfollowing', async (req, res) => {
  const { userId, targetId } = req.query;
  if (!userId || !targetId) return res.status(400).json({ error: "Missing parameters" });

  try {
    let cursor = null;
    let isFollowing = false;

    do {
      const url = `https://friends.roblox.com/v1/users/${userId}/followings?limit=100${cursor ? `&cursor=${cursor}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.data.some(user => user.id === Number(targetId))) {
        isFollowing = true;
        break;
      }

      cursor = data.nextPageCursor;
    } while (cursor);

    res.json({ isFollowing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
