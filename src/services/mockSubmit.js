const MOCK_DELAY_MS = 1500;

/**
 * Mock API submit for the application form.
 * Simulates network delay and returns success.
 * @param {Object} formData - Full form data to submit
 * @returns {Promise<{ success: boolean, id?: string }>}
 */
export async function submitApplication(formData) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  // In production, you would POST to your backend:
  // const res = await fetch('/api/applications', { method: 'POST', body: JSON.stringify(formData) });
  return {
    success: true,
    id: `APP-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
}
