// Responde "o que você pode fazer?" -> 403 quando o perfil não tem permissão.
// Deve vir DEPOIS do autenticar (precisa do req.usuario).
export function autorizar(...perfis) {
  return (req, res, next) => {
    if (!req.usuario || !perfis.includes(req.usuario.role)) {
      return res.status(403).json({ erro: "acesso negado para o seu perfil" });
    }
    next();
  };
}
