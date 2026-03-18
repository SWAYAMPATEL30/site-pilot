// Shared role and permission constants

export const ROLE_LEVEL = { owner: 4, admin: 3, editor: 2, viewer: 1 };
export const ROLE_COLOR = { owner: '#f59e0b', admin: '#8b5cf6', editor: '#10b981', viewer: '#6b7280' };

export const ROLE_META = {
    owner: {
        id: 'owner',
        label: 'Owner',
        color: '#f59e0b',
        desc: 'Ultimate access: manage everything including the billing'
    },
    admin: {
        id: 'admin',
        label: 'Admin',
        color: '#8b5cf6',
        desc: 'Full access: manage team, branding, deployments, billing'
    },
    editor: {
        id: 'editor',
        label: 'Editor',
        color: '#10b981',
        desc: 'Create & edit websites, use AI builder, manage branding'
    },
    viewer: {
        id: 'viewer',
        label: 'Viewer',
        color: '#6b7280',
        desc: 'Read-only access to websites and analytics'
    },
};

export const PERMISSIONS = {
    owner: [
        'Manage Team',
        'Manage Branding',
        'AI Builder',
        'Create Websites',
        'Delete Websites',
        'View Analytics',
        'Domains',
        'Deployments',
        'Billing',
        'Versions'
    ],
    admin: [
        'Manage Team',
        'Manage Branding',
        'AI Builder',
        'Create Websites',
        'Delete Websites',
        'View Analytics',
        'Domains',
        'Deployments',
        'Billing',
        'Versions'
    ],
    editor: [
        'Manage Branding',
        'AI Builder',
        'Create Websites',
        'View Analytics',
        'Versions'
    ],
    viewer: [
        'View Analytics',
        'Versions (read-only)'
    ],
};
