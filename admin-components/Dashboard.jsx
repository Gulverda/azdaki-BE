// ადმინპანელის მთავარი გვერდი — AdminJS-ის default "Welcome on Board"-ის ნაცვლად
import { Box, H2, Icon, Text } from '@adminjs/design-system';
import React from 'react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  { resource: 'News', label: 'სიახლეები', icon: 'FileText' },
  { resource: 'Performance', label: 'სპექტაკლები', icon: 'Film' },
  { resource: 'Showtime', label: 'ჩვენებები (განრიგი)', icon: 'Calendar' },
  { resource: 'GalleryItem', label: 'გალერეა', icon: 'Image' },
  { resource: 'AboutPage', label: 'თეატრის ისტორია', icon: 'BookOpen' },
  { resource: 'StaffMember', label: 'დასი და გუნდი', icon: 'Users' },
  { resource: 'Sponsor', label: 'სპონსორები', icon: 'Award' },
];

const Dashboard = () => (
  <Box variant="grey" p="xxl">
    <H2 mb="lg">აზდაკის ბაღი — ადმინპანელი</H2>
    <Text mb="xl">აირჩიე სექცია, რომლის რედაქტირებაც გინდა.</Text>
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
      }}
    >
      {SECTIONS.map(({ resource, label, icon }) => (
        <Link
          key={resource}
          to={`/admin/resources/${resource}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Box variant="white" p="xl" flex alignItems="center" style={{ gap: 12 }}>
            <Icon icon={icon} size={24} />
            <Text fontWeight="bold">{label}</Text>
          </Box>
        </Link>
      ))}
    </Box>
  </Box>
);

export default Dashboard;
