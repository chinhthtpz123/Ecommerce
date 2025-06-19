
'use strict';

const ShopRoles = {
    SHOP: '0000',
    WRITER: '0001',
    EDITOR: '0002',
    ADMIN: '0003',
}

const ShopRoleList = Object.values(ShopRoles);

module.exports = {
    ShopRoles,
    ShopRoleList
};