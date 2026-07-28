import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from "react-email";

import { AuthEmailLayoutProps } from "@/email/interface/templates.interface";

export default function AuthEmailLayout({
    preview,
    companyName,
    appUrl,
    supportEmail,
    logoUrl,
    children,
}: AuthEmailLayoutProps) {
    return (
        <Tailwind>
            <Html>
                <Head />

                <Preview>{preview}</Preview>

                <Body className="m-0 bg-gray-100 py-10 font-sans">
                    <Container className="mx-auto w-full max-w-[600px] rounded-xl bg-white px-10 py-12">

                        {/* Header */}
                        <Section className="mb-10 text-center">

                            <Link
                                href={appUrl}
                                className="inline-block no-underline"
                            >
                                {logoUrl ? (
                                    <Img
                                        src={logoUrl}
                                        alt={companyName}
                                        className="mx-auto h-14 w-auto"
                                    />
                                ) : (
                                    <Heading className="m-0 text-3xl font-bold text-blue-600">
                                        {companyName}
                                    </Heading>
                                )}
                            </Link>

                        </Section>

                        {/* Page Content */}
                        {children}

                        {/* Footer */}
                        <Section className="mt-12 border-t border-gray-200 pt-6">

                            <Text className="m-0 text-center text-xs text-gray-500">
                                © {new Date().getFullYear()} {companyName}. All rights reserved.
                            </Text>

                            <Text className="mt-2 text-center text-xs text-gray-500">
                                Need help?{" "}
                                <Link
                                    href={`mailto:${supportEmail}`}
                                    className="text-blue-600 no-underline"
                                >
                                    {supportEmail}
                                </Link>
                            </Text>

                            <Text className="mt-2 text-center text-xs text-gray-500">
                                This is an automated email. Please do not reply.
                            </Text>

                        </Section>

                    </Container>
                </Body>
            </Html>
        </Tailwind>
    );
}