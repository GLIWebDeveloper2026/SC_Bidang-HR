/** KerjaKink — Tailwind color extension */
module.exports = {
  theme: {
    extend: {
      fontFamily: { sans: ['Poppins', 'system-ui', 'sans-serif'] },
      borderRadius: { DEFAULT: '6px', lg: '10px' },
      colors: {
        primary: { DEFAULT: '#1890FF', hover: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
        success: { bg: '#F6FFED', text: '#237804', border: '#B7EB8F' },
        warning: { bg: '#FFFBE6', text: '#D48806', border: '#FFE58F' },
        error:   { bg: '#FFF1F0', text: '#CF1322', border: '#FFA39E', btn: '#FF4D4F', btnHover: '#CF1322' },
        ink:     { DEFAULT: '#262626', secondary: '#595959', placeholder: '#8C8C8C' },
        surface: { page: '#FAFAFA', card: '#FFFFFF' },
        line:    { DEFAULT: '#D9D9D9', focus: '#1890FF' }
      }
    }
  }
};
