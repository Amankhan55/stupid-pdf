# Contributing to StupidPDF

Thank you for your interest in contributing to **StupidPDF**! 🎉  
Whether it's fixing a bug, adding a new PDF tool, improving the UI, or writing docs — every contribution is appreciated.

---

## 🚀 Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/stupid-pdf.git
   cd stupid-pdf
   ```
3. Follow the **Local Setup** instructions in the [README.md](README.md).
4. Create a new branch for your work:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

---

## 📐 Branch Naming Convention

Use prefixes to describe the type of change:

| Prefix | Purpose |
|---|---|
| `feat/` | New feature or tool |
| `fix/` | Bug fix |
| `docs/` | Documentation changes |
| `style/` | UI / CSS changes |
| `refactor/` | Code restructure without new features |
| `chore/` | Dependency updates, config changes |

**Examples:**
- `feat/pdf-to-word`
- `fix/compress-pdf-memory-leak`
- `docs/update-readme`

---

## 🔨 Development Workflow

### Backend (Python / FastAPI)
```bash
cd backend
source venv/bin/activate
python main.py  # Starts on http://localhost:8000
```

### Frontend (React / Vite)
```bash
cd frontend
npm run dev     # Starts on http://localhost:5173
```

---

## ✅ Pull Request Guidelines

Before submitting a PR, please make sure:

- [ ] Your code works locally and doesn't break existing features.
- [ ] You've tested the feature with actual PDF files.
- [ ] No secrets, `.env` files, or credentials are committed.
- [ ] Code follows the existing style and patterns.
- [ ] PR title is clear and follows the format: `feat: add PDF to Word tool`.
- [ ] PR description explains **what** changed and **why**.

---

## 🐛 Reporting Bugs

Use [GitHub Issues](https://github.com/Amankhan55/stupid-pdf/issues) to report bugs. Please include:

- A clear title and description of the problem.
- Steps to reproduce the issue.
- Expected vs. actual behavior.
- Screenshots or error messages if applicable.
- Your OS, browser, and Node/Python version.

---

## 💡 Feature Requests

Have an idea for a new PDF tool or improvement? [Open a Feature Request issue](https://github.com/Amankhan55/stupid-pdf/issues/new?template=feature_request.md) with:

- A clear description of the feature.
- The problem it solves.
- Any relevant examples or references.

---

## 📋 Code Style

### Python (Backend)
- Follow [PEP 8](https://peps.python.org/pep-0008/) conventions.
- Keep service functions focused and stateless — all PDF processing must use `io.BytesIO` (no disk writes).
- New tools should add a route in `routes/pdf_routes.py` and service logic in `services/pdf_service.py`.

### JavaScript / React (Frontend)
- Use functional components with React hooks.
- Custom SVG icons go in `components/Icons.jsx`.
- CSS uses the existing design token system in `index.css` — avoid inline styles.
- New API calls go in the `api/` directory.

---

## 🛡️ Security

If you discover a security vulnerability, **please do NOT open a public issue**.  
Instead, use the [Contact page](https://stupid-pdf-opal.vercel.app/contact) to report it privately.

---

## 📄 License

By contributing to StupidPDF, you agree that your contributions will be licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

Note: The "StupidPDF" name, logo, and brand assets are separately reserved and **not** covered by the AGPL. See [NOTICE.md](NOTICE.md) for details.
