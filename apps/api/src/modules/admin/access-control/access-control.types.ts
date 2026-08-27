// access-control.types.ts

export type CreateUserInput = {
    name: string;
    username: string;
    email?: string | null;
    password: string;
    roleIds: number[];
};

export type UpdateUserInput = {
    name?: string;
    username?: string;
    email?: string | null;
    password?: string;
    roleIds?: number[];
    isActive?: boolean;
};

export type CreateRoleInput = {
    name: string;
    description?: string | null;
};

export type UpdateRoleInput = {
    name?: string;
    description?: string | null;
};

export type UpdateRolePermissionsInput = {
    permissionIds: number[];
};



export type FindAllUsersParams = {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sort?: string;
};