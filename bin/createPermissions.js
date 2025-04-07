const prisma = require('../src/utils/prisma.js')

const permissions = [
    { permission: 'events.create', description: '' },
    { permission: 'events.update', description: '' },
    { permission: 'events.delete', description: '' },
    { permission: 'events.list', description: '' },
    { permission: 'events.retrieve', description: '' },
    { permission: 'profiles.create', description: '' },
    { permission: 'profiles.update', description: '' },
    { permission: 'profiles.delete', description: '' },
    { permission: 'profiles.list', description: '' },
    { permission: 'profiles.retrieve', description: '' },
]

try {
    permissions.forEach(async ({ permission, description }) => {
        await prisma.permission.create({
            data: {
                permission: permission,
                description: description,
            }
        });
    });
} catch (error) {
    throw new Error();
}
