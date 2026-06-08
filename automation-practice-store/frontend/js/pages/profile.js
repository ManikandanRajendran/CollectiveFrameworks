async function renderProfilePage() {
  if (!requireAuth()) {
    Router.navigate('/login');
    return;
  }

  setBreadcrumb([
    { label: 'Home', href: '#/products' },
    { label: 'Profile', href: '#/profile' },
  ]);

  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div data-testid="profile-page">
      <h1 class="page-title" data-testid="profile-title">Customer Profile</h1>
      <p class="page-subtitle">Update your details — text fields, dropdown, radio, checkbox, date &amp; file upload</p>

      <div id="profile-alert" class="alert hidden" role="alert" data-testid="profile-alert"></div>

      <div class="tabs" data-testid="profile-tabs">
        <button type="button" class="tab-btn active" data-tab="personal" data-testid="tab-personal">Personal</button>
        <button type="button" class="tab-btn" data-tab="address" data-testid="tab-address">Address</button>
        <button type="button" class="tab-btn" data-tab="preferences" data-testid="tab-preferences">Preferences</button>
      </div>

      <form id="profile-form" data-testid="profile-form">
        <div id="tab-personal" class="tab-panel card" data-testid="panel-personal">
          <div class="grid-2">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" data-testid="first-name-input" required>
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" data-testid="last-name-input" required>
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" data-testid="email-input" required>
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone" data-testid="phone-input" placeholder="555-0100">
          </div>
          <div class="form-group">
            <label for="birthDate">Date of Birth (optional)</label>
            <input type="date" id="birthDate" name="birthDate" data-testid="birth-date-input">
          </div>
        </div>

        <div id="tab-address" class="tab-panel card hidden" data-testid="panel-address">
          <div class="form-group">
            <label for="address">Street Address</label>
            <textarea id="address" name="address" rows="3" data-testid="address-textarea"></textarea>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label for="city">City</label>
              <input type="text" id="city" name="city" data-testid="city-input">
            </div>
            <div class="form-group">
              <label for="state">State</label>
              <select id="state" name="state" data-testid="state-dropdown">
                <option value="">Select state</option>
                <option value="CA">California</option>
                <option value="TX">Texas</option>
                <option value="NY">New York</option>
                <option value="FL">Florida</option>
                <option value="WA">Washington</option>
              </select>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label for="zipCode">ZIP Code</label>
              <input type="text" id="zipCode" name="zipCode" data-testid="zip-input">
            </div>
            <div class="form-group">
              <label for="country">Country</label>
              <select id="country" name="country" data-testid="country-dropdown">
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="IN">India</option>
              </select>
            </div>
          </div>
        </div>

        <div id="tab-preferences" class="tab-panel card hidden" data-testid="panel-preferences">
          <fieldset class="form-group" data-testid="contact-radio-group">
            <legend>Preferred Contact Method</legend>
            <div class="radio-group">
              <label><input type="radio" name="preferredContact" value="email" data-testid="contact-email-radio"> Email</label>
              <label><input type="radio" name="preferredContact" value="phone" data-testid="contact-phone-radio"> Phone</label>
              <label><input type="radio" name="preferredContact" value="sms" data-testid="contact-sms-radio"> SMS</label>
            </div>
          </fieldset>

          <div class="form-group">
            <label for="membershipTier">Membership Tier</label>
            <select id="membershipTier" name="membershipTier" data-testid="membership-dropdown">
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" id="newsletter" name="newsletter" data-testid="newsletter-checkbox">
              Subscribe to newsletter
            </label>
          </div>

          <div class="form-group">
            <label for="avatar">Upload Avatar (optional)</label>
            <input type="file" id="avatar" name="avatar" data-testid="avatar-file-input" accept="image/*">
            <p class="hint">File upload for automation practice — not persisted to backend</p>
          </div>
        </div>

        <div class="btn-group" style="margin-top:1rem">
          <button type="submit" class="btn btn-primary" data-testid="save-profile-button">Save Profile</button>
          <button type="reset" class="btn btn-secondary" data-testid="reset-profile-button">Reset</button>
        </div>
      </form>
    </div>
  `;

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('hidden');
    });
  });

  const res = await API.customer.getProfile();
  const profile = res.data;

  document.getElementById('firstName').value = profile.firstName || '';
  document.getElementById('lastName').value = profile.lastName || '';
  document.getElementById('email').value = profile.email || '';
  document.getElementById('phone').value = profile.phone || '';
  document.getElementById('address').value = profile.address || '';
  document.getElementById('city').value = profile.city || '';
  document.getElementById('state').value = profile.state || '';
  document.getElementById('zipCode').value = profile.zipCode || '';
  document.getElementById('country').value = profile.country || 'US';
  document.getElementById('membershipTier').value = profile.membershipTier || 'bronze';
  document.getElementById('newsletter').checked = profile.newsletter === 'true';

  const contactRadio = document.querySelector(
    `input[name="preferredContact"][value="${profile.preferredContact || 'email'}"]`
  );
  if (contactRadio) contactRadio.checked = true;

  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertEl = document.getElementById('profile-alert');

    const preferredContact =
      document.querySelector('input[name="preferredContact"]:checked')?.value || 'email';

    try {
      await API.customer.updateProfile({
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        country: document.getElementById('country').value,
        preferredContact,
        membershipTier: document.getElementById('membershipTier').value,
        newsletter: document.getElementById('newsletter').checked,
      });

      alertEl.className = 'alert alert-success';
      alertEl.textContent = 'Profile saved successfully!';
      alertEl.classList.remove('hidden');
      showToast('Profile updated', 'success');
      await updateHeaderAuth();
    } catch (err) {
      alertEl.className = 'alert alert-error';
      alertEl.textContent = err.message;
      alertEl.classList.remove('hidden');
    }
  });
}
