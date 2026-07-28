import {
    Heading,
    Text,
    Section,
} from "react-email";
import AuthEmailLayout from "@email/components/auth-email-layout";
import { VerifyEmailTemplateProps } from "@email/interface/templates.interface";

export function VerifyEmailTemplate({
    firstName,
    otp,
    expiryMinutes,
    companyName,
    ...rest      // context rest props
}: VerifyEmailTemplateProps) {
    return (
        <AuthEmailLayout
            preview={`Verify your email address for ${companyName}`}
            companyName={companyName}
            {...rest}    // context rest props
        >

            {/* Title */}
            <Heading className="m-0 mb-6 text-center text-3xl font-bold text-gray-900">
                Verify your email
            </Heading>

            {/* Greeting */}
            <Text className="m-0 mb-5 text-base leading-7 text-gray-700">
                Hi <strong>{firstName}</strong>,
            </Text>

            <Text className="m-0 mb-6 text-base leading-7 text-gray-700">
                Thank you for creating your account. Use the verification code
                below to complete your registration.
            </Text>

            {/* OTP Box */}
            <Section className="my-10 rounded-xl border border-gray-200 bg-gray-50 py-6 text-center">
                <Text className="m-0 text-sm uppercase tracking-widest text-gray-500">
                    Verification Code
                </Text>

                <Heading className="m-0 mt-3 text-5xl font-bold tracking-[12px] text-blue-600">
                    {otp}
                </Heading>
            </Section>

            {/* Expiry */}
            <Text className="m-0 mb-4 text-center text-sm text-gray-600">
                This code expires in{" "}
                <strong>{expiryMinutes} minutes</strong>.
            </Text>

            <Text className="m-0 mb-8 text-center text-sm text-gray-600">
                For your security, never share this code with anyone.
            </Text>

            {/* Ignore */}
            <Section className="rounded-lg bg-gray-50 px-5 py-4">
                <Text className="m-0 text-sm leading-6 text-gray-600">
                    If you didn't create an account, you can safely ignore this
                    email. No changes will be made to your account.
                </Text>
            </Section>
        </AuthEmailLayout>
    );
}

VerifyEmailTemplate.PreviewProps = {
    firstName: "Firoz",
    otp: "483921",
    expiryMinutes: 10,
    companyName: "Touch-Yatra",
    appUrl: "touchyatra.com",
    supportEmail: "support@touchyatra.com"
} satisfies VerifyEmailTemplateProps;

export default VerifyEmailTemplate;