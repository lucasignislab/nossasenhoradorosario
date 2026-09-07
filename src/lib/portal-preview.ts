// Prévia demonstrativa do portal controlada por variável de ambiente.
// Defina NEXT_PUBLIC_PORTAL_PREVIEW=true apenas em desenvolvimento local;
// em produção (variável ausente), o acesso real com Supabase é usado.
export const isPortalPreviewEnabled = process.env.NEXT_PUBLIC_PORTAL_PREVIEW === 'true';
