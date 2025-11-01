# 🗓️ Continuous Calendar (Next.js + Tailwind)

Um **calendário contínuo e responsivo** em React/Next.js, estilizado com Tailwind CSS, com suporte a marcação de pessoas por data, badges de contagem e modal com avatares e detalhes do funcionário.

---

## ✨ Recursos

- Navegação contínua por meses (carrossel horizontal de 12 painéis)
- Seletores de mês e ano + botão **Hoje**
- Badge com contagem de pessoas por dia
- Modal (Headless UI) com avatares das pessoas do dia
- Detalhes do funcionário (nome, cargo, tarefa, contatos, notas)
- Temas claro/escuro (escopo local)
- Totalmente responsivo (mobile-first)
- Componentizado:
  - `ContinuousCalendar` (núcleo)
  - `CalendarWithPeople` (UX completa)

---

## 🧱 Stack

- [Next.js (App Router)](https://nextjs.org/docs/app)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.com/)
- [`next/image`](https://nextjs.org/docs/api-reference/next/image)

---

## 📁 Estrutura de Pastas

.
├─ app/
│ ├─ page.tsx
│ └─ globals.css
├─ components/
│ ├─ ContinuousCalendar.tsx
│ └─ CalendarWithPeople.tsx
├─ public/
├─ next.config.mjs
├─ tailwind.config.(ts|js)
└─ README.md

---

## 🚀 Começando

### 1️⃣ Clonar e instalar

```bash
git clone <seu-repo-url>
cd <pasta-do-projeto>
pnpm install   # ou npm install / yarn

```

<img src="https://i.imgur.com/fS82jhl.png" alt="calendario ligth"><br>
<img src="https://imgur.com/CkfuvsO.png" alt="calendario dark">
