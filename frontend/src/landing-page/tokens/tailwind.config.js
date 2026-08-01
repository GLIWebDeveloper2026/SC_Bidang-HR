/** KerjaKink — Tailwind color extension */
module.exports = {
  theme: {
    extend: {
      fontFamily: { sans: ['Poppins', 'system-ui', 'sans-serif'] },
      borderRadius: { DEFAULT: '6px', lg: '10px' },
      colors: {
        primary: { DEFAULT: '#606BDF', hover: '#4A54B3', bg: '#EDEDFB', border: '#8B93E8' },
        success: { bg: '#F6FFED', text: '#237804', border: '#B7EB8F' },
        warning: { bg: '#FFFBE6', text: '#D48806', border: '#FFE58F' },
        error:   { bg: '#FFF1F0', text: '#CF1322', border: '#FFA39E', btn: '#FF4D4F', btnHover: '#CF1322' },
        ink:     { DEFAULT: '#1B1B1F', secondary: '#6B6B6F', placeholder: '#9A9AA1' },
        surface: { page: '#F5F2FA', card: '#FFFFFF' },
        line:    { DEFAULT: '#DFDBE8', focus: '#606BDF' }
      }
    }
  }
};
