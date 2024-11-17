export const parsePathParameters = (req: Request, routePath: string): Record<string, string> => {
  const url = new URL(req.url);
  const routeRegex = new RegExp(`^${routePath.replace(/\$([^/]+)/g, '(?<$1>[^/]+)')}$`);
  const match = routeRegex.exec(url.pathname);

  return match?.groups || {};
};
