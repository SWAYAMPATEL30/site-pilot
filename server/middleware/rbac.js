const ROLE_HIERARCHY = { owner: 4, admin: 3, editor: 2, developer: 1 };

const PERMISSIONS = {
    'website.create': ['owner', 'admin'],
    'website.edit': ['owner', 'admin', 'editor'],
    'website.delete': ['owner', 'admin'],
    'website.publish': ['owner', 'admin'],
    'page.create': ['owner', 'admin', 'editor'],
    'page.edit': ['owner', 'admin', 'editor'],
    'page.delete': ['owner', 'admin'],
    'page.publish': ['owner', 'admin'],
    'ai.generate': ['owner', 'admin', 'editor', 'developer'],
    'team.invite': ['owner', 'admin'],
    'team.remove': ['owner', 'admin'],
    'team.changeRole': ['owner'],
    'billing.view': ['owner', 'admin'],
    'billing.manage': ['owner'],
    'domain.manage': ['owner', 'admin'],
    'branding.manage': ['owner', 'admin'],
    'analytics.view': ['owner', 'admin', 'editor'],
    'deploy.create': ['owner', 'admin'],
    'deploy.rollback': ['owner', 'admin'],
    'settings.manage': ['owner', 'admin'],
};

export const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Authentication required' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    next();
};

export const requirePermission = (permission) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Authentication required' });
    const allowedRoles = PERMISSIONS[permission];
    if (!allowedRoles || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ success: false, error: `Permission '${permission}' denied for role '${req.user.role}'` });
    }
    next();
};

export const getPermissions = (role) => {
    return Object.entries(PERMISSIONS)
        .filter(([, roles]) => roles.includes(role))
        .map(([perm]) => perm);
};

export { PERMISSIONS, ROLE_HIERARCHY };
