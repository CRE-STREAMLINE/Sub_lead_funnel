"use client"

import { useState, useEffect } from "react"
import "./form.css"

interface FormData {
  involvement: string
  city: string
  experience: string
  challenge: string
  challengeOther?: string
  fullName: string
  email: string
  phone: string
  company: string
  consent: boolean
  score: number
  priority: string
}

const CITIES = [
  "Houston, TX",
  "Dallas, TX",
  "Austin, TX",
  "San Antonio, TX",
  "Fort Worth, TX",
  "El Paso, TX",
  "Atlanta, GA",
  "Miami, FL",
  "Orlando, FL",
  "Tampa, FL",
  "Phoenix, AZ",
  "Los Angeles, CA",
  "San Francisco, CA",
  "San Diego, CA",
  "Las Vegas, NV",
  "Denver, CO",
  "Chicago, IL",
  "New York, NY",
  "Boston, MA",
  "Philadelphia, PA",
  "Washington, DC",
  "Charlotte, NC",
  "Nashville, TN",
  "Other",
]

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbygyEMFohUdSuqhdd3JtHMneSVtZ6QsTG3bpzaFVzzyRqfBTa4_UK8p8e8qGsSdh8pEgQ/exec"

export default function LeadForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    involvement: "",
    city: "",
    experience: "",
    challenge: "",
    challengeOther: "",
    fullName: "",
    email: "",
    phone: "",
    company: "",
    consent: false,
    score: 0,
    priority: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDisqualified, setShowDisqualified] = useState(false)

  // Add this after your existing useState declarations
  useEffect(() => {
    // Check if we're returning from a successful submission
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("success") === "true") {
      setCurrentStep(6)
    }
  }, [])

  const calculateScore = (involvement: string, city: string) => {
    let score = 0

    // Involvement scoring
    if (
      involvement === "Commercial real estate agent" ||
      involvement === "Looking to get into commercial real estate sales"
    ) {
      score += 10
    } else if (involvement === "Investor") {
      score += 8
    } else if (involvement === "Residential real estate agent") {
      score += 5
    }

    // City scoring (Houston gets highest priority)
    if (city === "Houston, TX") {
      score += 5
    } else if (city.includes("TX")) {
      score += 3
    } else {
      score += 1
    }

    return score
  }

  const getPriority = (involvement: string, city: string) => {
    if (
      city === "Houston, TX" &&
      (involvement === "Commercial real estate agent" ||
        involvement === "Looking to get into commercial real estate sales")
    ) {
      return "Highest"
    } else if (city === "Houston, TX") {
      return "High"
    } else if (city.includes("TX")) {
      return "Medium"
    } else {
      return "Low"
    }
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (formData.involvement === "None of the above") {
        setShowDisqualified(true)
        return
      }
    }

    if (currentStep === 2) {
      const score = calculateScore(formData.involvement, formData.city)
      const priority = getPriority(formData.involvement, formData.city)
      setFormData((prev) => ({ ...prev, score, priority }))
    }

    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!formData.consent) {
      alert("Please agree to receive updates to continue.")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare the submission data
      const submissionData = {
        involvement: formData.involvement,
        city: formData.city,
        experience: formData.experience,
        challenge: formData.challenge === "Other" ? formData.challengeOther : formData.challenge,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        score: formData.score,
        priority: formData.priority,
        submittedAt: new Date().toISOString(),
      }

      console.log("Submitting to Google Apps Script:", submissionData)

      // Send to Google Apps Script only
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
        mode: "no-cors",
      })

      console.log("Submission completed")

      // Go to success page
      setCurrentStep(6)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Submission error:", error)
      alert("There was an error submitting the form. Please try again or contact us directly at vasilios@kmgmt.co")
      setIsSubmitting(false)
    }
  }

  const isHoustonCommercial =
    formData.city === "Houston, TX" &&
    (formData.involvement === "Commercial real estate agent" ||
      formData.involvement === "Looking to get into commercial real estate sales")

  if (showDisqualified) {
    return (
      <div className="streamline-form-container">
        <div className="streamline-form-wrapper">
          <div className="streamline-form-header">
            <img src="/assets/images/logo/logo.png" alt="Streamline Logo" className="form-logo" />
            <h1>Thank You for Your Interest</h1>
          </div>

          <div className="disqualified-message">
            <h2>🔔 Stay Connected</h2>
            <p>
              Streamline currently works with professionals in commercial real estate. Subscribe to hear about future
              updates.
            </p>

            <div className="newsletter-signup">
              <form action="https://formsubmit.co/vasilios@kmgmt.co" method="POST">
                <input type="hidden" name="_honey" value="" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_subject" value="Newsletter Signup - Future Updates" />

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    required
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Subscribe for Updates
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 6) {
    return (
      <div className="streamline-form-container">
        <div className="streamline-form-wrapper">
          <div className="streamline-form-header">
            <img src="/assets/images/logo/logo.png" alt="Streamline Logo" className="form-logo" />
            <h1>Thank You!</h1>
          </div>

          <div className="confirmation-message">
            {isHoustonCommercial ? (
              <>
                <div className="success-icon">✅</div>
                <h2>You're a perfect fit for Streamline!</h2>
                <p>
                  We'll be reaching out soon to get you connected to our platform and exclusive Houston commercial real
                  estate opportunities.
                </p>
              </>
            ) : (
              <>
                <div className="pending-icon">🕒</div>
                <h2>We're expanding rapidly</h2>
                <p>
                  You'll be among the first to know when Streamline launches in your market. We're excited to bring our
                  platform to more cities soon!
                </p>
              </>
            )}

            <div className="next-steps">
              <h3>What's Next?</h3>
              <ul>
                <li>Check your email for confirmation</li>
                <li>Follow us for updates</li>
                <li>Expect to hear from our team within 48 hours</li>
              </ul>
            </div>

            <a href="/" className="btn-primary">
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="streamline-form-container">
      <div className="streamline-form-wrapper">
        <div className="streamline-form-header">
          <img src="/assets/images/logo/logo.png" alt="Streamline Logo" className="form-logo" />
          <h1>Join Streamline</h1>
          <p>Houston's Premier Commercial Real Estate Platform</p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentStep / 5) * 100}%` }}></div>
        </div>

        <div className="step-indicator">Step {currentStep} of 5</div>

        {currentStep === 1 && (
          <div className="form-step">
            <h2>What's your current real estate involvement?</h2>
            <div className="radio-group">
              {[
                "Commercial real estate agent",
                "Looking to get into commercial real estate sales",
                "Investor",
                "Residential real estate agent",
                "None of the above",
              ].map((option) => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name="involvement"
                    value={option}
                    checked={formData.involvement === option}
                    onChange={(e) => setFormData((prev) => ({ ...prev, involvement: e.target.value }))}
                  />
                  <span className="radio-custom"></span>
                  {option}
                </label>
              ))}
            </div>
            <button className="btn-primary btn-next" onClick={handleNext} disabled={!formData.involvement}>
              Next
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <h2>Which city are you currently doing real estate in?</h2>
            <select
              className="form-control"
              value={formData.city}
              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
            >
              <option value="">Select a city</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {formData.city && formData.city !== "Houston, TX" && (
              <div className="city-message">
                <p>We're only live in Houston for now. You'll be notified as we expand into your market.</p>
              </div>
            )}

            <div className="form-navigation">
              <button className="btn-secondary" onClick={handleBack}>
                Back
              </button>
              <button className="btn-primary" onClick={handleNext} disabled={!formData.city}>
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <h2>How much experience do you have in real estate sales?</h2>
            <div className="radio-group">
              {[
                "Just getting started",
                "1–2 years",
                "2–5 years",
                "5–10 years",
                "10+ years",
                "I'm not in sales, I'm an investor",
              ].map((option) => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name="experience"
                    value={option}
                    checked={formData.experience === option}
                    onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                  />
                  <span className="radio-custom"></span>
                  {option}
                </label>
              ))}
            </div>
            <div className="form-navigation">
              <button className="btn-secondary" onClick={handleBack}>
                Back
              </button>
              <button className="btn-primary" onClick={handleNext} disabled={!formData.experience}>
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="form-step">
            <h2>What's your biggest challenge in real estate right now?</h2>
            <div className="radio-group">
              {[
                "Finding off-market deals",
                "Finding serious buyers",
                "Matching deals to investors/agents",
                "Generating leads",
                "Back-office/coordination",
                "Other",
              ].map((option) => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name="challenge"
                    value={option}
                    checked={formData.challenge === option}
                    onChange={(e) => setFormData((prev) => ({ ...prev, challenge: e.target.value }))}
                  />
                  <span className="radio-custom"></span>
                  {option}
                </label>
              ))}
            </div>

            {formData.challenge === "Other" && (
              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="Please describe your biggest challenge..."
                  value={formData.challengeOther}
                  onChange={(e) => setFormData((prev) => ({ ...prev, challengeOther: e.target.value }))}
                  rows={3}
                />
              </div>
            )}

            <div className="form-navigation">
              <button className="btn-secondary" onClick={handleBack}>
                Back
              </button>
              <button
                className="btn-primary"
                onClick={handleNext}
                disabled={!formData.challenge || (formData.challenge === "Other" && !formData.challengeOther)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="form-step">
            <h2>Contact Information</h2>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                className="form-control"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                className="form-control"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Company / Brokerage</label>
              <input
                type="text"
                className="form-control"
                placeholder="Your Company Name"
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
              />
            </div>

            <div className="consent-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, consent: e.target.checked }))}
                />
                <span className="checkbox-custom"></span>I agree to receive updates from Kambouras Management inc. via
                email or SMS.
              </label>
            </div>

            <div className="form-navigation">
              <button className="btn-secondary" onClick={handleBack}>
                Back
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={!formData.fullName || !formData.email || !formData.consent || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
