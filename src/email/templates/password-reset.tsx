import {
    Button,
    Heading,
    Hr,
    Section,
    Text,
} from "react-email";

import AuthEmailLayout from "@/email/components/auth-email-layout";
import { PasswordResetTemplateProps } from "../interface/templates.interface";

export default function PasswordResetTemplate({
    firstName,
    resetLink,
    otp,
    expiryMinutes,
    ...context
}: PasswordResetTemplateProps) {
    return (
        <AuthEmailLayout
            preview="Reset your password"
            {...context}
        >

            {/* Title */}
            <Heading className="m-0 mb-6 text-center text-3xl font-bold text-gray-900">
                Reset your password
            </Heading>

            {/* Greeting */}
            <Text className="m-0 mb-5 text-base leading-7 text-gray-700">
                Hi <strong>{firstName}</strong>,
            </Text>

            <Text className="m-0 mb-8 text-base leading-7 text-gray-700">
                We received a request to reset your password.
                Click the button below to create a new password.
            </Text>

            {/* Reset Button */}
            <Section className="mb-10 text-center">

                <Button
                    href={resetLink}
                    className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white no-underline"
                >
                    Reset Password
                </Button>

            </Section>

            <Hr className="my-8 border-gray-200" />

            {/* Alternative Option */}
            <Text className="m-0 mb-5 text-center text-base leading-7 text-gray-700">
                If the button doesn't work, use the verification code below.
            </Text>

            <Section className="rounded-xl border border-gray-200 bg-gray-50 py-6 text-center">

                <Text className="m-0 text-sm uppercase tracking-widest text-gray-500">
                    Verification Code
                </Text>

                <Heading className="m-0 mt-4 text-5xl font-bold tracking-[10px] text-blue-600">
                    {otp}
                </Heading>

            </Section>

            {/* Expiry */}
            <Text className="mt-8 text-center text-sm text-gray-600">
                This password reset link and verification code will expire in{" "}
                <strong>{expiryMinutes} minutes</strong>.
            </Text>

            {/* Security Notice */}
            <Section className="mt-8 rounded-lg bg-amber-50 border border-amber-200 px-5 py-4">

                <Text className="m-0 text-sm leading-6 text-amber-900">
                    <strong>Didn't request this?</strong>
                    <br />
                    If you did not request a password reset, you can safely ignore this email.
                    Your password will remain unchanged.
                </Text>

            </Section>

        </AuthEmailLayout>
    );
}


PasswordResetTemplate.PreviewProps = {
    firstName: "Firoz",
    resetLink: "https://example.com/reset-password?token=sample-token",
    otp: "483921",
    expiryMinutes: 10,

    companyName: "Touch Yatra",
    appUrl: "https://touchyatra.com",
    supportEmail: "support@touchyatra.com",
    logoUrl: "https://example.com/logo.png",
} satisfies PasswordResetTemplateProps;