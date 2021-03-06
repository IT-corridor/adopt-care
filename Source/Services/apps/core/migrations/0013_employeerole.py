# Generated by Django 2.0.7 on 2019-03-12 08:03

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_auto_20190306_0211'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeRole',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='facility_roles', to='core.EmployeeProfile')),
                ('facility', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Facility')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.ProviderRole')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
