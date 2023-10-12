import { useRouter } from 'next/router';

export default function convertNumberBasedOnDirection(num: number): string | number {
  const router = useRouter();
  const lang = router.pathname.split('/')[1]; // This gets the 'en' or 'ar' from the URL.

  if (lang === 'ar') {
    // Convert to Arabic numerals
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumerals[parseInt(digit)]).join('');
  }
  
  return num;
}
