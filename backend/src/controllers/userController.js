const bcrypt = require('bcryptjs');
const db = require('../configs/db');
const { users } = require('../models/userSchema');
const { eq } = require('drizzle-orm');

const register = async (req, res) => {
  console.log('收到註冊請求');

  const { user_name, email, password } = req.body;

  if (!user_name || !email || !password) {
    return res.status(400).json({ error: '請填寫所有欄位' });
  }

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (existing.length > 0) {
      return res.status(409).json({ error: '此 email 已被註冊' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      user_name,
      email,
      password_hash: hashedPassword,
    });

    res.status(201).json({ message: '註冊成功' });
  } catch (err) {
    console.error('❌ 註冊失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

module.exports = {
  register
};
