import * as React from 'react';
import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import styled from 'styled-components';
import { breakpoint } from 'styled-components-breakpoint';
import PageContentBlock from '@/components/elements/PageContentBlock';
import ConfigureOAuthForm from "@/components/dashboard/forms/ConfigureOAuthForm";

const Container = styled.div`
    ${tw`flex flex-wrap my-10`};

    & > div {
        ${tw`w-full`};

        ${breakpoint('md')`
            width: calc(50% - 1rem);
        `}

        ${breakpoint('xl')`
            ${tw`w-auto flex-1`};
        `}
    }
`;

export default () => {
    return (
        <PageContentBlock>
            <Container>
                <ContentBox title={'Update Password'} showFlashes={'account:password'}>
                    <UpdatePasswordForm/>
                </ContentBox>
                <ContentBox
                    className={'mt-8 md:mt-0 md:ml-8'}
                    title={'Update Email Address'}
                    showFlashes={'account:email'}
                >
                    <UpdateEmailAddressForm/>
                </ContentBox>
                <div>
                    <ContentBox className={'xl:ml-8 mt-8 xl:mt-0 mb-4'} title={'Configure Two Factor'}>
                        <ConfigureTwoFactorForm/>
                    </ContentBox>
                    <ContentBox className={'xl:ml-8 mt-8 xl:mt-0'} title={'Configure OAuth'}>
                        <ConfigureOAuthForm/>
                    </ContentBox>
                </div>
            </Container>
        </PageContentBlock>
    );
};
