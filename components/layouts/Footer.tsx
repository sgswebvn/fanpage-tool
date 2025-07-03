export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#f8f9fa', padding: '20px 0' }}>
      <div style={{ textAlign: 'center', color: '#6c757d' }}>
        <p>&copy; {new Date().getFullYear()} Fanpage Tool. All rights reserved.</p>
        <p>
          <a href="/privacy-policy" style={{ color: '#007bff', textDecoration: 'none' }}>
            Privacy Policy
          </a>
        </p>
      </div>
    </footer>
  );
}   