// Role hierarchy: owner > admin > editor > developer
const ROLE_HIERARCHY = { owner: 4, admin: 3, editor: 2, developer: 1 };

const PERMISSIONS = {
  'manage_billing': ['owner'],
  'manage_plan': ['owner'],
  'delete_tenant': ['owner'],
  'manage_team': ['owner', 'admin'],
  'invite_users': ['owner', 'admin'],
  'remove_users': ['owner', 'admin'],
  'manage_domains': ['owner', 'admin'],
  'manage_settings': ['owner', 'admin'],
  'publish_website': ['owner', 'admin'],
  'deploy_website': ['owner', 'admin', 'developer'],
  'create_website': ['owner', 'admin'],
  'delete_website': ['owner', 'admin'],
  'edit_content': ['owner', 'admin', 'editor'],
  'create_page': ['owner', 'admin', 'editor'],
  'delete_page': ['owner', 'admin'],
  'edit_branding': ['owner', 'admin', 'editor'],
  'use_ai': ['owner', 'admin', 'editor', 'developer'],
  'view_analytics': ['owner', 'admin', 'editor'],
  'view_deployments': ['owner', 'admin', 'developer'],
  'view_versions': ['owner', 'admin', 'editor', 'developer'],
  'rollback_version': ['owner', 'admin'],
  'manage_seo': ['owner', 'admin', 'editor'],
  'view_billing': ['owner'],
};

export function hasPermission(userRole, permission) {
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

export function getRoleLevel(role) {
  return ROLE_HIERARCHY[role] || 0;
}

export function canManageRole(managerRole, targetRole) {
  return getRoleLevel(managerRole) > getRoleLevel(targetRole);
}

export function getAllPermissions() {
  return PERMISSIONS;
}

export function getUserPermissions(role) {
  const perms = {};
  for (const [perm, roles] of Object.entries(PERMISSIONS)) {
    perms[perm] = roles.includes(role);
  }
  return perms;
}

export const ROLES = [
  { id: 'owner', name: 'Owner', description: 'Full access to all features and settings', level: 4 },
  { id: 'admin', name: 'Administrator', description: 'Manage team, settings, and publishing', level: 3 },
  { id: 'editor', name: 'Editor', description: 'Create and edit content and pages', level: 2 },
  { id: 'developer', name: 'Developer', description: 'Deploy sites and use developer tools', level: 1 },
];
