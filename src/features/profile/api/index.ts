const BASE_USER_CONTROLLER = "user";

export enum UserController {
  Profile = `${BASE_USER_CONTROLLER}/me`,
  UpdateUser = `${BASE_USER_CONTROLLER}/update-user`,
  UpdateUserSettings = `${BASE_USER_CONTROLLER}/update-user-setting`,
}

export const QUERY_KEYS = {
  profile: ["profile", "user"],
};

export const MUTATION_KEYS = {
  profile: {
    updateUser: () => ["profile", "user", "update"],
    updateSettings: () => ["profile", "user", "settings", "update"],
  },
};
