# Translation Implementation Guide

## ✅ Completed Implementation

### 1. **Translation Infrastructure**
All translation files have been created for English (en) and Tagalog (tl):

#### Translation Files Created:
- ✅ `src/i18n/locales/en/common.json` - Common UI elements (buttons, labels, messages)
- ✅ `src/i18n/locales/tl/common.json` - Tagalog version
- ✅ `src/i18n/locales/en/home.json` - Home page content
- ✅ `src/i18n/locales/tl/home.json` - Tagalog version
- ✅ `src/i18n/locales/en/auth.json` - Authentication pages
- ✅ `src/i18n/locales/tl/auth.json` - Tagalog version
- ✅ `src/i18n/locales/en/jobs.json` - Job-related pages
- ✅ `src/i18n/locales/tl/jobs.json` - Tagalog version
- ✅ `src/i18n/locales/en/profile.json` - Profile page
- ✅ `src/i18n/locales/tl/profile.json` - Tagalog version
- ✅ `src/i18n/locales/en/chat.json` - Chat page
- ✅ `src/i18n/locales/tl/chat.json` - Tagalog version
- ✅ `src/i18n/locales/en/components.json` - Reusable components
- ✅ `src/i18n/locales/tl/components.json` - Tagalog version
- ✅ `src/i18n/locales/en/settings.json` - Settings modal (already existed)
- ✅ `src/i18n/locales/tl/settings.json` - Tagalog version (already existed)

### 2. **Core Files Updated**
- ✅ `src/contexts/LanguageContext.tsx` - Updated to include all translation imports
- ✅ `src/hooks/useLanguage.ts` - Hook for accessing translations
- ✅ `src/app/layout.tsx` - Added LanguageProvider wrapper
- ✅ `src/components/modals/SettingsModal.tsx` - Fully translated (test case)
- ✅ `src/app/page.tsx` - Home page fully translated

---

## 📋 Implementation Pattern

### How to Add Translations to Any Component/Page:

#### Step 1: Import the useLanguage hook
```typescript
import { useLanguage } from '@/hooks/useLanguage';
```

#### Step 2: Use the hook in your component
```typescript
export default function YourComponent() {
  const { t } = useLanguage();

  // Now you can access translations
  return <h1>{t.common.buttons.save}</h1>;
}
```

#### Step 3: Replace static text with translation keys
**Before:**
```typescript
<button>Save Changes</button>
```

**After:**
```typescript
<button>{t.common.buttons.save}</button>
```

---

## 🎯 Quick Reference for Common Translations

### Common Buttons
```typescript
{t.common.buttons.getStarted}      // "Get Started" / "Magsimula"
{t.common.buttons.signIn}          // "Sign In" / "Mag-sign In"
{t.common.buttons.signUp}          // "Sign Up" / "Mag-sign Up"
{t.common.buttons.save}            // "Save" / "I-save"
{t.common.buttons.cancel}          // "Cancel" / "Kanselahin"
{t.common.buttons.delete}          // "Delete" / "Tanggalin"
{t.common.buttons.edit}            // "Edit" / "I-edit"
```

### Navigation
```typescript
{t.common.navigation.backToHome}    // "Back to Home" / "Bumalik sa Home"
{t.common.navigation.backToLogin}   // "Back to Login" / "Bumalik sa Login"
{t.common.navigation.backToProfile} // "Back to Profile" / "Bumalik sa Profile"
```

### Labels
```typescript
{t.common.labels.sortBy}     // "Sort by" / "Pagbukud-bukurin ayon sa"
{t.common.labels.search}     // "Search" / "Maghanap"
{t.common.labels.loading}    // "Loading..." / "Naglo-load..."
{t.common.labels.email}      // "Email" / "Email"
{t.common.labels.password}   // "Password" / "Password"
```

### Messages
```typescript
{t.common.messages.authRequired}   // "Authentication Required" / "Kailangan ng Authentication"
{t.common.messages.pleaseLogin}    // "Please log in to access this feature."
{t.common.messages.errorOccurred}  // "An error occurred" / "May naganap na error"
```

---

## 📁 Translation Structure Reference

### Available Translation Namespaces:

1. **t.common** - Shared UI elements
   - `buttons` - All button labels
   - `navigation` - Navigation links
   - `labels` - Form labels, general labels
   - `messages` - Common messages
   - `roles` - User roles

2. **t.home** - Home page content
   - `hero.title`
   - `hero.titleHighlight`
   - `hero.description`
   - `benefits.*`
   - `howItWorks.*`

3. **t.auth** - Authentication pages
   - `login.*`
   - `signup.*`
   - `forgotPassword.*`
   - `resetPassword.*`

4. **t.jobs** - Job-related content
   - `findJobs.*`
   - `appliedJobs.*`
   - `manageJobPosts.*`
   - `jobCard.*`
   - `jobDetails.*`

5. **t.profile** - Profile page
   - `sections.*`
   - `fields.*`
   - `placeholders.*`
   - `buttons.*`
   - `messages.*`

6. **t.chat** - Chat functionality
   - Message-related translations

7. **t.components** - Reusable components
   - `header.*`
   - `footer.*`
   - `filters.*`
   - `sort.*`
   - `pagination.*`
   - `deleteModal.*`
   - `notifications.*`
   - `searchBar.*`
   - `rating.*`

8. **t.settings** - Settings modal (already implemented)

---

## 🔧 Implementation Checklist for Remaining Pages

### Auth Pages (High Priority)
- [ ] `src/components/auth/LoginForm.tsx`
- [ ] `src/components/auth/SignupForm.tsx`
- [ ] `src/components/auth/ForgotPasswordForm.tsx`
- [ ] `src/components/auth/ResetPasswordForm.tsx`
- [ ] `src/app/login/page.tsx`
- [ ] `src/app/signup/page.tsx`
- [ ] `src/app/forgot-password/page.tsx`
- [ ] `src/app/reset-password/page.tsx`

### Header/Footer Components (High Priority)
- [ ] `src/components/ui/HeaderHome.tsx`
- [ ] `src/components/ui/HeaderDashboard.tsx`
- [ ] `src/components/ui/Footer.tsx`
- [ ] `src/components/ui/ProfileDropdown.tsx`

### Job Pages (Medium Priority)
- [ ] `src/app/findJobs/page.tsx`
- [ ] `src/app/appliedJobs/page.tsx`
- [ ] `src/app/manageJobPosts/page.tsx`
- [ ] `src/components/cards/JobPostCard.tsx`
- [ ] `src/components/cards/AppliedJobCardList.tsx`
- [ ] `src/components/cards/ManageJobPostCard.tsx`
- [ ] `src/components/modals/JobPostViewModal.tsx`
- [ ] `src/components/modals/JobPostAddModal.tsx`
- [ ] `src/components/modals/JobPostEditModal.tsx`

### Profile Page (Medium Priority)
- [ ] `src/app/profile/page.tsx`
- [ ] `src/components/profile/ProfileForm.tsx`
- [ ] `src/components/profile/ProfileSection.tsx`
- [ ] `src/components/profile/ProjectSection.tsx`

### Chat Page (Medium Priority)
- [ ] `src/app/chat/page.tsx`
- [ ] `src/components/chat/RealtimeChat.tsx`
- [ ] `src/components/chat/ChatMessage.tsx`
- [ ] `src/components/chat/ChatRoomList.tsx`

### Shared Components (Low Priority)
- [ ] `src/components/ui/FilterSection.tsx`
- [ ] `src/components/ui/Sort.tsx`
- [ ] `src/components/ui/SearchBar.tsx`
- [ ] `src/components/ui/DeleteModal.tsx`
- [ ] `src/components/notifications/NotificationPopUp.tsx`
- [ ] `src/components/notifications/NotificationCard.tsx`

### Home Page Sections (Low Priority)
- [ ] `src/components/home/BenefitsSection.tsx`
- [ ] `src/components/home/HowItWorksSection.tsx`
- [ ] `src/components/home/RecommendedJobsSection.tsx`
- [ ] `src/components/home/PopularJobCategoriesSection.tsx`
- [ ] `src/components/home/TestimonialsSection.tsx`

---

## 💡 Tips & Best Practices

### 1. **Dynamic Content**
For dynamic content with variables, use template replacement:
```typescript
// In translation file:
{
  "welcome": "Welcome, {{name}}!"
}

// In component:
const message = t.profile.welcome.replace('{{name}}', user.name);
```

### 2. **Conditional Translations**
```typescript
// Status translations
const statusText = t.jobs.appliedJobs.status[application.status];
// Will get: pending, reviewing, accepted, or rejected
```

### 3. **Preserve Functionality**
- ✅ Only translate static user-facing text
- ❌ Do NOT translate:
  - Variable names
  - Function names
  - API endpoints
  - Database field names
  - Console logs (optional)
  - Technical error codes

### 4. **Testing**
After adding translations to a component:
1. Change language in Settings modal
2. Verify all text updates
3. Check that UI layout doesn't break
4. Test all button/link functionality

---

## 🚀 Next Steps

### To implement translations in remaining files:

1. **Pick a file from the checklist**
2. **Read the file** to identify static text
3. **Import useLanguage hook**
4. **Replace static strings** with translation keys
5. **Test the changes**
6. **Mark as complete** in checklist

### Example Implementation (LoginForm.tsx):

```typescript
'use client';
import { useLanguage } from '@/hooks/useLanguage';

export default function LoginForm() {
  const { t } = useLanguage();

  return (
    <form>
      <h1>{t.auth.login.title}</h1>
      <p>{t.auth.login.subtitle}</p>

      <label>{t.auth.login.emailLabel}</label>
      <input placeholder={t.auth.login.emailPlaceholder} />

      <label>{t.auth.login.passwordLabel}</label>
      <input placeholder={t.auth.login.passwordPlaceholder} />

      <button>{t.auth.login.loginButton}</button>
    </form>
  );
}
```

---

## ✨ Current Status

**Fully Translated:**
- ✅ Settings Modal
- ✅ Home Page Hero Section
- ✅ Translation Infrastructure (all files created)

**Ready to Implement:**
- All remaining pages and components listed in checklist above
- All translation keys are prepared in JSON files
- Pattern is established and tested

---

## 🔍 Testing Your Changes

1. Start the dev server: `npm run dev`
2. Open Settings (gear icon in header when logged in)
3. Change language between English and Tagalog
4. Navigate through pages to see translations update
5. Verify functionality remains unchanged

---

## 📞 Need Help?

All translation files are located in:
- `src/i18n/locales/en/` (English)
- `src/i18n/locales/tl/` (Tagalog)

The LanguageContext provides the `t` object with all translations.
Use TypeScript autocomplete to explore available translation keys!
