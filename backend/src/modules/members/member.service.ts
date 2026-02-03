// Helper untuk query Prisma berdasarkan role admin
export const getRegionFilter = (user: any) => {

  if (user.role === 'ADMIN_PUSAT') {
    return {}; 
  }
  if (!user.regionCode) return {}; 

  const code = user.regionCode;
  switch (user.role) {
    case 'ADMIN_PROVINSI': return { provinceCode: code };
    case 'ADMIN_KABUPATEN': return { regencyCode: code };
    case 'ADMIN_KECAMATAN': return { districtCode: code };
    case 'ADMIN_KELURAHAN': return { villageCode: code };
    default: return { provinceCode: '99999' }; // No access
  }
};