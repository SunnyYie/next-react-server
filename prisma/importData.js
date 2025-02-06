const fs = require('fs');
const path = require('path');

const { PrismaClient, PermissionType } = require('@prisma/client');
const prisma = new PrismaClient();

const dataFilePath = path.join(__dirname, 'flat.json');
const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

async function main() {
  for (const item of data) {
    await prisma.userPermissions.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        name: item.name,
        label: item.label,
        type:
          item.type == 0
            ? PermissionType.CATALOGUE
            : item.type == 1
              ? PermissionType.MENU
              : PermissionType.BUTTON,
        route: item.route,
        order: item.order,
        icon: item.icon,
        component: item.component,
        parentId: item.parentId || null,
      },
    });
  }
  console.log('Data imported successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
