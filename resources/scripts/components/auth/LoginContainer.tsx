import React, { useRef } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login, { LoginData } from '@/api/auth/login';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { ActionCreator, Actions, useStoreActions, useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { FormikProps, withFormik } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import { httpErrorToHuman } from '@/api/http';
import { FlashMessage } from '@/state/flashes';
import ReCAPTCHA from 'react-google-recaptcha';
import Spinner from '@/components/elements/Spinner';

type OwnProps = RouteComponentProps & {
    clearFlashes: ActionCreator<void>;
    addFlash: ActionCreator<FlashMessage>;
}

const LoginContainer = ({ isSubmitting, setFieldValue, values, submitForm, handleSubmit }: OwnProps & FormikProps<LoginData>) => {
    const ref = useRef<ReCAPTCHA | null>(null);
    const { enabled: recaptchaEnabled, siteKey } = useStoreState<ApplicationStore, any>(state => state.settings.data!.recaptcha);
    const { enabled: oauthEnabled, required: oauthRequired, drivers } = useStoreState<ApplicationStore, any>(state => state.settings.data!.oauth);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (ref.current && !values.recaptchaData) {
            return ref.current.execute();
        }

        handleSubmit(e);
    };

    return (
        <React.Fragment>
            {ref.current && ref.current.render()}
            <LoginFormContainer
                title={'Login to Continue'}
                className={'w-full flex'}
                onSubmit={submit}
            >
                {(!oauthEnabled || !oauthRequired) &&
                <React.Fragment>
                    <label htmlFor={'username'}>Username or Email</label>
                    <Field
                        type={'text'}
                        id={'username'}
                        name={'username'}
                        className={'input'}
                    />
                    <div className={'mt-6'}>
                        <label htmlFor={'password'}>Password</label>
                        <Field
                            type={'password'}
                            id={'password'}
                            name={'password'}
                            className={'input'}
                        />
                    </div>
                    <div className={'mt-6'}>
                        <button
                            type={'submit'}
                            className={'btn btn-primary btn-jumbo'}
                        >
                            {isSubmitting ?
                                <Spinner size={'tiny'} className={'mx-auto'}/>
                                :
                                'Login'
                            }
                        </button>
                    </div>
                    {recaptchaEnabled &&
                    <ReCAPTCHA
                        ref={ref}
                        size={'invisible'}
                        sitekey={siteKey || '_invalid_key'}
                        onChange={token => {
                            ref.current && ref.current.reset();
                            setFieldValue('recaptchaData', token);
                            submitForm();
                        }}
                        onExpired={() => setFieldValue('recaptchaData', null)}
                    />
                    }
                    <div className={'mt-6 text-center'}>
                        <Link
                            to={'/auth/password'}
                            className={'text-xs text-neutral-500 tracking-wide no-underline uppercase hover:text-neutral-600'}
                        >
                            Forgot password?
                        </Link>
                    </div>
                    { oauthEnabled &&
                    <div className={'border-t-2 border-neutral-50 my-4'}/>
                    }
                </React.Fragment>
                }
                { oauthEnabled &&
                <div className={'text-s text-neutral-500 text-center' + (oauthRequired ? ' mt-20' : '')}>
                    {JSON.parse(drivers).map((driver: string) => (
                        <a href={'/auth/oauth?driver=' + driver}>
                            <img src={'/assets/svgs/' + driver + '.svg'} className={'inline-block w-12 mx-1'} alt={driver}/>
                        </a>
                    ))}
                </div>
                }

            </LoginFormContainer>
        </React.Fragment>
    );
};

const EnhancedForm = withFormik<OwnProps, LoginData>({
    displayName: 'LoginContainerForm',

    mapPropsToValues: (props) => ({
        username: '',
        password: '',
        recaptchaData: null,
    }),

    validationSchema: () => object().shape({
        username: string().required('A username or email must be provided.'),
        password: string().required('Please enter your account password.'),
    }),

    handleSubmit: (values, { props, setFieldValue, setSubmitting }) => {
        props.clearFlashes();
        login(values)
            .then(response => {
                if (response.complete) {
                    // @ts-ignore
                    window.location = response.intended || '/';
                    return;
                }

                props.history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch(error => {
                console.error(error);

                setSubmitting(false);
                setFieldValue('recaptchaData', null);
                props.addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            });
    },
})(LoginContainer);

export default (props: RouteComponentProps) => {
    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    return (
        <EnhancedForm
            {...props}
            addFlash={addFlash}
            clearFlashes={clearFlashes}
        />
    );
};
