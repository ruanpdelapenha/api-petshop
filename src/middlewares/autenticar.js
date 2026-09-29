import jwt from "jsonwebtoken";

// Responde "quem é você?" -> 401 quando não dá para provar a identidade.
export function autenticar(req, res, next) {
  const header = req.headers.authorization;

  // 401 tipo 1: sem token
  if (!header) {
    return res.status(401).json({ erro: "token não informado" });
  }

  // 401 tipo 2: formato errado (esperado: "Bearer <token>")
  const [tipo, token] = header.split(" ");
  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ erro: "formato inválido. Use: Authorization: Bearer <token>" });
  }

  // 401 tipo 3: token inválido, adulterado ou expirado
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: Number(payload.sub), role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ erro: "token inválido ou expirado" });
  }
}
