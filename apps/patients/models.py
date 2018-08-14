from django.db import models
from care_adopt_backend.mixins import (
    AddressMixin, CreatedModifiedMixin, UUIDPrimaryKeyMixin)
from apps.accounts.models import EmailUser
from apps.core.models import (
    Organization, Facility, EmployeeProfile, Diagnosis, Procedure, Medication, )


class PatientProfile(CreatedModifiedMixin, UUIDPrimaryKeyMixin):
    user = models.OneToOneField(
        EmailUser, on_delete=models.CASCADE, related_name='patient_profile')
    facility = models.ForeignKey(
        Facility, null=False, blank=False, on_delete=models.CASCADE)
    STATUS_CHOICES = (
        ('pre-potential', 'Pre Potential'),
        ('potential', 'Potential'),
        ('invited', 'Invited'),
        ('delinquent', 'Delinquent'),
        ('inactive', 'Inactive'),
        ('active', 'Active'),
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pre-potential')
    diagnosis = models.ManyToManyField('PatientDiagnosis', blank=True)

    class Meta:
        ordering = ('user', )

    def __str__(self):
        return '{} {}'.format(self.user.first_name, self.user.last_name)


class ProblemArea(CreatedModifiedMixin, UUIDPrimaryKeyMixin):
    patient = models.ForeignKey(
        PatientProfile, null=False, blank=False, on_delete=models.CASCADE)
    identified_by = models.ForeignKey(
        EmployeeProfile, null=True, blank=True, on_delete=models.SET_NULL)
    date_identified = models.DateField(null=True, blank=True)
    name = models.CharField(max_length=140, null=False, blank=False)
    description = models.CharField(max_length=512, null=True, blank=True)

    class Meta:
        ordering = ('patient', 'name', )

    def __str__(self):
        return '{}: {}'.format(self.patient, self.name)


class PatientDiagnosis(UUIDPrimaryKeyMixin):
    patient = models.ForeignKey(
        PatientProfile, null=False, blank=False, on_delete=models.CASCADE)
    diagnosis = models.ForeignKey(
        Diagnosis, null=False, blank=False, on_delete=models.CASCADE)
    # TODO: Add choices
    type = models.CharField(max_length=20, null=False, blank=False)
    date_identified = models.DateField(null=True, blank=True)
    diagnosing_practitioner = models.CharField(max_length=140, null=True, blank=True)
    facility = models.CharField(max_length=140, null=True, blank=True)

    class Meta:
        ordering = ('patient', 'diagnosis', )
        verbose_name_plural = 'patient diagnosis'

    def __str__(self):
        return '{}: {}'.format(self.patient, self.diagnosis)


class PatientProcedure(UUIDPrimaryKeyMixin):
    patient = models.ForeignKey(
        PatientProfile, null=False, blank=False, on_delete=models.CASCADE)
    procedure = models.ForeignKey(
        Procedure, null=False, blank=False, on_delete=models.CASCADE)
    date_of_procedure = models.DateField(null=True, blank=True)
    attending_practitioner = models.CharField(max_length=140, null=True, blank=True)
    facility = models.CharField(max_length=140, null=True, blank=True)

    class Meta:
        ordering = ('patient', 'procedure', )

    def __str__(self):
        return '{}: {}'.format(self.patient, self.procedure)


class PatientMedication(UUIDPrimaryKeyMixin):
    patient = models.ForeignKey(
        PatientProfile, null=False, blank=False, on_delete=models.CASCADE)
    medication = models.ForeignKey(
        Medication, null=False, blank=False, on_delete=models.CASCADE)
    dose_mg = models.IntegerField(null=False, blank=False)
    date_prescribed = models.DateField(null=False, blank=False)
    duration_days = models.IntegerField(null=False, blank=False)
    refills = models.IntegerField(default=0)
    prescribing_practitioner = models.ForeignKey(
        EmployeeProfile, null=True, blank=True, on_delete=models.SET_NULL)
    instructions = models.CharField(max_length=480, null=True, blank=True)

    class Meta:
        ordering = ('patient', 'medication', )

    def __str__(self):
        return '{}: {}'.format(self.patient, self.medication)